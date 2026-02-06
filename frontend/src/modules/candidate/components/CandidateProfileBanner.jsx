import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import Card from "../../../components/ui/Card";
import BasicDetailsModal from "./BasicDetailsModal";
import {
  useGetProfileOverviewQuery,
  useUpdateBasicDetailsMutation,
  useUploadPhotoMutation,
} from "../../../features/candidate/candidateProfileApi";
import AvatarBlock from "./banner/AvatarBlock";
import ProfileBannerHeader from "./banner/ProfileBannerHeader";
import BasicInfoBlock from "./banner/BasicInfoBlock";
import MissingDetailsPanel from "./banner/MissingDetailsPanel";
import BannerMeta from "./banner/BannerMeta";
import { availabilityOptions, detailIconMap, sectionMap } from "./banner/bannerConfig";

export default function CandidateProfileBanner({ onJumpToSection }) {
  const { data, isLoading } = useGetProfileOverviewQuery();
  const profile = data?.profile || {};
  const completionPercent = data?.profile_completion_percent ?? 0;
  const missingDetails = data?.missing_details ?? [];
  const missingCount = data?.missing_count ?? missingDetails.length;
  const lastUpdated = data?.last_updated;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");
  const [uploadPhoto, { isLoading: isUploadingPhoto }] = useUploadPhotoMutation();
  const [updateBasicDetails, { isLoading: isSaving }] = useUpdateBasicDetailsMutation();

  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, completionPercent));
  const offset = circumference - (progress / 100) * circumference;

  const displayPhoto = photoPreview || profile.photo_url;
  const topMissing = useMemo(() => missingDetails.slice(0, 3), [missingDetails]);

  const formattedLocation = useMemo(() => {
    const city = profile.location?.trim();
    const rawCountry = profile.location_country?.trim();
    const country = rawCountry?.toLowerCase() === "india" ? "INDIA" : rawCountry;
    if (city && country) return `${city}, ${country}`;
    return city || country || "Add location";
  }, [profile.location, profile.location_country]);

  const formattedUpdated = useMemo(() => {
    if (!lastUpdated) return "-";
    const dateObj = new Date(lastUpdated);
    if (Number.isNaN(dateObj.getTime())) return "-";
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
      .format(dateObj)
      .replace(/ /g, "")
      .replace(/(\d{2})([A-Za-z]{3}) (\d{4})/, "$1$2, $3")
      .replace(/(\d{2})([A-Za-z]{3})(\d{4})/, "$1$2, $3");
  }, [lastUpdated]);

  const leftRows = useMemo(
    () => [
      { key: "location", icon: detailIconMap.location, value: formattedLocation },
      { key: "email", icon: detailIconMap.email, value: profile.email || "Add email" },
      {
        key: "availability",
        icon: detailIconMap.availability,
        value: profile.availability_to_join || "Add availability",
      },
    ],
    [formattedLocation, profile.email, profile.availability_to_join]
  );

  const rightRows = useMemo(
    () => [
      { key: "phone", icon: detailIconMap.phone, value: profile.phone || "Add phone" },
      { key: "work", icon: detailIconMap.work, value: profile.work_status || "Add work status" },
    ],
    [profile.phone, profile.work_status]
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

  const handleJump = (key) => {
    if (!onJumpToSection) return;
    onJumpToSection(sectionMap[key] || "personal");
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="h-24 w-full animate-pulse rounded-2xl bg-surface-2" />
      </Card>
    );
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
        />

        <div className="space-y-3">
          <div className="space-y-2 border-b border-surface-3/70 pb-3">
            <ProfileBannerHeader
              name={profile.full_name || "Candidate"}
              onEdit={() => setIsModalOpen(true)}
            />
            <BannerMeta updated={formattedUpdated} />
          </div>
          <BasicInfoBlock leftRows={leftRows} rightRows={rightRows} />
        </div>

        <MissingDetailsPanel
          missingCount={missingCount}
          topMissing={topMissing}
          onJump={handleJump}
          ctaLabel={{
            text: `Add ${missingCount || missingDetails.length} missing details`,
            onClick: () => handleJump(missingDetails[0]?.key || "personal"),
          }}
        />
      </div>

      {isModalOpen && (
        <BasicDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveBasicDetails}
          isSaving={isSaving}
          initialValues={{
            full_name: profile.full_name || "",
            work_status: profile.work_status || "",
            location_country: profile.location_country || "India",
            location: profile.location || "",
            phone: profile.phone || "",
            email: profile.email || "",
            availability_to_join: profile.availability_to_join || "",
          }}
          availabilityOptions={availabilityOptions}
        />
      )}
    </Card>
  );
}
