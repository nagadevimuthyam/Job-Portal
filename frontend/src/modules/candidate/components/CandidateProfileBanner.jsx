import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import BasicDetailsModal from "./BasicDetailsModal";
import {
  useGetProfileOverviewQuery,
  useUpdateBasicDetailsMutation,
  useUpdateProfileMutation,
  useUploadPhotoMutation,
} from "../../../features/candidate/candidateProfileApi";
import AvatarBlock from "./banner/AvatarBlock";
import ProfileBannerHeader from "./banner/ProfileBannerHeader";
import BasicInfoBlock from "./banner/BasicInfoBlock";
import MissingDetailsPanel from "./banner/MissingDetailsPanel";
import BannerMeta from "./banner/BannerMeta";
import { detailIconMap, sectionMap } from "./banner/bannerConfig";
import { normalizeMissingDetails } from "../utils/missingDetails";
import {
  formatCandidateLocationForBanner,
  formatCandidateExperienceLabel,
  getNoticePeriodLabel,
  formatCandidateUpdatedAt,
  getLatestEmployment,
  buildCandidateEmploymentHeadline,
} from "../../../shared/selectors/candidateSelectors";

export default function CandidateProfileBanner({
  onJumpToSection,
  mode = "candidate",
  overviewData,
  actionsSlot,
}) {
  const isEmployer = mode === "employer";
  const { data, isLoading } = useGetProfileOverviewQuery(undefined, { skip: isEmployer });
  const sourceData = overviewData || data;
  const profile = sourceData?.profile || {};
  const completionPercent = sourceData?.profile_completion_percent ?? 0;
  const missingDetails = sourceData?.missing_details ?? [];
  const normalizedMissingDetails = useMemo(
    () => normalizeMissingDetails(missingDetails),
    [missingDetails]
  );
  const missingCount = sourceData?.missing_count ?? normalizedMissingDetails.length;
  const lastUpdated = sourceData?.last_updated;
  const employments = sourceData?.employments ?? [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");
  const [uploadPhoto, { isLoading: isUploadingPhoto }] = useUploadPhotoMutation();
  const [updateBasicDetails, { isLoading: isSaving }] = useUpdateBasicDetailsMutation();
  const [updateProfile, { isLoading: isSavingVisibility }] = useUpdateProfileMutation();

  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, completionPercent));
  const offset = circumference - (progress / 100) * circumference;

  const displayPhoto = photoPreview || profile.photo_url;
  const topMissing = useMemo(() => normalizedMissingDetails.slice(0, 3), [
    normalizedMissingDetails,
  ]);
  const isSearchable = Boolean(profile.is_searchable);
  const canEnableVisibility = completionPercent >= 60;

  const formattedLocation = useMemo(
    () => formatCandidateLocationForBanner(profile),
    [profile.current_city, profile.current_state, profile.country, profile.location, profile.location_country]
  );

  const formattedUpdated = useMemo(() => formatCandidateUpdatedAt(lastUpdated), [lastUpdated]);

  const latestEmployment = useMemo(() => getLatestEmployment(employments), [employments]);
  const employmentTitle = latestEmployment?.title?.trim() || "";
  const employmentCompany = latestEmployment?.company?.trim() || "";
  const employmentSummary = useMemo(
    () => buildCandidateEmploymentHeadline(employmentTitle, employmentCompany),
    [employmentTitle, employmentCompany]
  );

  const noticePeriodLabel = useMemo(() => getNoticePeriodLabel(profile), [profile]);

  const leftRows = useMemo(
    () => [
          { key: "location", icon: detailIconMap.location, value: formattedLocation },
          { key: "email", icon: detailIconMap.email, value: profile.email || "Add email" },
          {
        key: "availability",
        icon: detailIconMap.availability,
        value: noticePeriodLabel,
      },
    ],
    [formattedLocation, profile.email, noticePeriodLabel]
  );

  const experienceLabel = useMemo(
    () => formatCandidateExperienceLabel(profile),
    [profile.total_experience_years, profile.work_status]
  );

  const rightRows = useMemo(
    () => [
      { key: "phone", icon: detailIconMap.phone, value: profile.phone || "Add phone" },
      {
        key: "work",
        icon: detailIconMap.work,
        value: experienceLabel || "Add experience",
      },
    ],
    [profile.phone, experienceLabel]
  );

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error("Photo must be 2MB or smaller.");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
    try {
      await uploadPhoto(file).unwrap();
      toast.success("Photo updated.");
      setPhotoPreview("");
    } catch (err) {
      toast.error(err?.data?.error?.message || "Unable to upload photo.");
      setPhotoPreview("");
    }
  };

  const handleSaveBasicDetails = async (payload) => {
    try {
      await updateBasicDetails(payload).unwrap();
      toast.success("Basic details updated.");
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err?.data?.error?.message || "Unable to update basic details.");
    }
  };

  const handleToggleVisibility = async () => {
    if (!canEnableVisibility && !isSearchable) {
      toast.error("Complete at least 60% of your profile to enable visibility.");
      return;
    }
    try {
      await updateProfile({ is_searchable: !isSearchable }).unwrap();
      toast.success(
        !isSearchable ? "Profile is now visible to employers." : "Profile visibility turned off."
      );
    } catch (err) {
      toast.error(err?.data?.error?.message || "Unable to update visibility.");
    }
  };

  const handleJump = (key) => {
    if (!onJumpToSection) return;
    onJumpToSection(sectionMap[key] || "personal");
  };

  if (isLoading && !overviewData) {
    return (
      <Card className="p-6">
        <div className="h-24 w-full animate-pulse rounded-2xl bg-surface-2" />
      </Card>
    );
  }

  if (!sourceData) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr_280px]">
        <AvatarBlock
          progress={progress}
          radius={radius}
          circumference={circumference}
          offset={offset}
          displayPhoto={displayPhoto}
          isUploadingPhoto={isUploadingPhoto}
          onFileChange={handlePhotoChange}
          readonly={isEmployer}
        />

        <div className="space-y-3">
          <div className="space-y-2 border-b border-surface-3/70 pb-3">
            <ProfileBannerHeader
              name={profile.full_name || "Candidate"}
              role={employmentTitle}
              company={employmentCompany}
              onEdit={() => setIsModalOpen(true)}
              editable={!isEmployer}
            />
            <BannerMeta updated={formattedUpdated} />
          </div>
          <BasicInfoBlock leftRows={leftRows} rightRows={rightRows} />
        </div>

        <div className="space-y-3">
          {isEmployer ? (
            actionsSlot || (
              <div className="flex flex-col gap-3">
                <Button type="button" variant="outline">
                  Shortlist
                </Button>
                <Button type="button" variant="outline">
                  Save to Folder
                </Button>
                <Button type="button" variant="outline">
                  Add Note
                </Button>
                <Button type="button">
                  Download Resume
                </Button>
              </div>
            )
          ) : (
            <>
              <MissingDetailsPanel
                missingCount={missingCount}
                topMissing={topMissing}
                onJump={handleJump}
                ctaLabel={{
                  text: `Add ${missingCount || normalizedMissingDetails.length} missing details`,
                  onClick: () => handleJump(normalizedMissingDetails[0]?.key || "personal"),
                }}
              />
              <div className="rounded-2xl border border-surface-3 bg-white/70 p-4 shadow-soft">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">Profile visibility</p>
                    <p className="text-xs text-ink-faint">Make my profile visible to employers</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isSearchable}
                    disabled={isSavingVisibility || (!canEnableVisibility && !isSearchable)}
                    onClick={handleToggleVisibility}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      isSearchable ? "bg-brand-600" : "bg-slate-300"
                    } ${isSavingVisibility || (!canEnableVisibility && !isSearchable) ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                        isSearchable ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                {!canEnableVisibility && !isSearchable && (
                  <p className="mt-2 text-xs text-ink-faint">
                    Complete at least 60% of your profile to enable visibility.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {isModalOpen && !isEmployer && (
        <BasicDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveBasicDetails}
          isSaving={isSaving}
          initialValues={{
            location_country: profile.location_country || "India",
            current_city: profile.current_city || profile.location || "",
            current_state: profile.current_state || "",
            country: profile.country || profile.location_country || "India",
            phone: profile.phone || "",
            email: profile.email || "",
            work_status: profile.work_status || "",
            total_experience_years: profile.total_experience_years ?? "",
            total_experience_months: profile.total_experience_months ?? "",
            availability_to_join: profile.availability_to_join || "",
            notice_period_code: profile.notice_period_code ?? null,
          }}
          employmentSummary={employmentSummary}
        />
      )}
    </Card>
  );
}
