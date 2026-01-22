import { useRef } from "react";
import { useParams } from "react-router-dom";
import Skeleton from "../../../components/ui/Skeleton";
import ProfileLayout from "../../candidate/components/ProfileLayout";
import ProfileCompletionCard from "../../candidate/components/ProfileCompletionCard";
import ProfileSectionCard from "../../candidate/components/ProfileSectionCard";
import ResumeCard from "../../candidate/components/ResumeCard";
import Button from "../../../components/ui/Button";
import { useGetCandidateProfileQuery } from "../../../features/employer/employerCandidateApi";

const formatDateRange = (start, end, isCurrent) => {
  if (!start) return "Dates not set";
  const startLabel = new Date(start).toLocaleDateString();
  if (isCurrent) return `${startLabel} - Present`;
  if (!end) return `${startLabel} -`;
  return `${startLabel} - ${new Date(end).toLocaleDateString()}`;
};

export default function CandidateProfile() {
  const { id } = useParams();
  const { data, isLoading } = useGetCandidateProfileQuery(id);
  const profile = data?.profile;
  const skills = data?.skills ?? [];
  const employments = data?.employments ?? [];
  const educations = data?.educations ?? [];
  const projects = data?.projects ?? [];

  const resumeRef = useRef(null);
  const summaryRef = useRef(null);
  const skillsRef = useRef(null);
  const employmentRef = useRef(null);
  const educationRef = useRef(null);
  const projectsRef = useRef(null);
  const personalRef = useRef(null);

  const quickLinks = [
    { id: "resume", label: "Resume" },
    { id: "summary", label: "Summary" },
    { id: "skills", label: "Key Skills" },
    { id: "employment", label: "Employment" },
    { id: "education", label: "Education" },
    { id: "projects", label: "Projects" },
    { id: "personal", label: "Personal Details" },
  ];

  const refMap = {
    resume: resumeRef,
    summary: summaryRef,
    skills: skillsRef,
    employment: employmentRef,
    education: educationRef,
    projects: projectsRef,
    personal: personalRef,
  };

  const handleQuickLink = (idValue) => {
    refMap[idValue]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!data) {
    return <div className="text-sm text-ink-faint">No candidate found.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">{profile?.full_name || "Candidate Profile"}</h1>
        <p className="text-sm text-ink-faint">{profile?.location || "Location not provided"}</p>
      </div>

      <ProfileLayout
        top={
          <div className="space-y-4">
            <ProfileCompletionCard
              percent={data?.profile_completion_percent ?? 0}
              lastUpdated={data?.last_updated}
              subtitle="Candidate profile snapshot."
            />
            <div className="rounded-xl border border-surface-3 bg-white/70 px-4 py-3 md:block">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {quickLinks.map((link) => (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => handleQuickLink(link.id)}
                    className="whitespace-nowrap rounded-full border border-surface-3 px-4 py-2 text-xs font-semibold text-ink hover:bg-surface-2"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        }
        sidebar={
          <div className="space-y-4 lg:sticky lg:top-24">
            <ProfileCompletionCard
              percent={data?.profile_completion_percent ?? 0}
              lastUpdated={data?.last_updated}
              subtitle="Candidate profile snapshot."
            />
            <div className="rounded-xl border border-surface-3 bg-white/70 px-4 py-4 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Quick links</p>
              <div className="mt-3 space-y-2 text-sm">
                {quickLinks.map((link) => (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => handleQuickLink(link.id)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-ink hover:bg-surface-2"
                  >
                    <span>{link.label}</span>
                    <span className="text-ink-faint">›</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        }
      >
        <div ref={resumeRef}>
          <ProfileSectionCard
            title="Resume"
            description="Download the latest resume."
            readonly
          >
            <ResumeCard resumeUrl={profile?.resume_url} readonly />
          </ProfileSectionCard>
        </div>

        <div ref={summaryRef}>
          <ProfileSectionCard
            title="Summary"
            description="Candidate overview."
            readonly
          >
            <p className="text-sm text-ink-soft">
              {profile?.summary || "No summary provided."}
            </p>
          </ProfileSectionCard>
        </div>

        <div ref={skillsRef}>
          <ProfileSectionCard
            title="Key Skills"
            description="Skills highlighted by the candidate."
            readonly
          >
            <div className="flex flex-wrap gap-2">
              {skills.length === 0 && (
                <span className="text-sm text-ink-faint">No skills listed.</span>
              )}
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-ink"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </ProfileSectionCard>
        </div>

        <div ref={employmentRef}>
          <ProfileSectionCard
            title="Employment"
            description="Roles and responsibilities."
            readonly
          >
            <div className="space-y-3">
              {employments.length === 0 && (
                <p className="text-sm text-ink-faint">No employment entries.</p>
              )}
              {employments.map((job) => (
                <div key={job.id} className="rounded-xl border border-surface-3 px-4 py-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-ink">{job.title}</p>
                      <p className="text-xs text-ink-faint">{job.company}</p>
                      <p className="text-xs text-ink-faint">
                        {formatDateRange(job.start_date, job.end_date, job.is_current)}
                      </p>
                    </div>
                    {job.is_current && (
                      <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
                        Current
                      </span>
                    )}
                  </div>
                  {job.description && (
                    <p className="mt-2 text-xs text-ink-soft">{job.description}</p>
                  )}
                </div>
              ))}
            </div>
          </ProfileSectionCard>
        </div>

        <div ref={educationRef}>
          <ProfileSectionCard
            title="Education"
            description="Academic background."
            readonly
          >
            <div className="space-y-3">
              {educations.length === 0 && (
                <p className="text-sm text-ink-faint">No education entries.</p>
              )}
              {educations.map((edu) => (
                <div key={edu.id} className="rounded-xl border border-surface-3 px-4 py-3">
                  <p className="text-sm font-semibold text-ink">{edu.degree}</p>
                  <p className="text-xs text-ink-faint">{edu.institution}</p>
                  <p className="text-xs text-ink-faint">
                    {edu.start_year} - {edu.end_year}
                  </p>
                </div>
              ))}
            </div>
          </ProfileSectionCard>
        </div>

        <div ref={projectsRef}>
          <ProfileSectionCard
            title="Projects"
            description="Showcase work samples."
            readonly
          >
            <div className="space-y-3">
              {projects.length === 0 && (
                <p className="text-sm text-ink-faint">No project entries.</p>
              )}
              {projects.map((project) => (
                <div key={project.id} className="rounded-xl border border-surface-3 px-4 py-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-ink">{project.title}</p>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-brand-700 underline"
                        >
                          {project.link}
                        </a>
                      )}
                    </div>
                    {project.link && (
                      <Button size="sm" variant="ghost" onClick={() => window.open(project.link, "_blank")}>
                        View
                      </Button>
                    )}
                  </div>
                  {project.description && (
                    <p className="mt-2 text-xs text-ink-soft">{project.description}</p>
                  )}
                </div>
              ))}
            </div>
          </ProfileSectionCard>
        </div>

        <div ref={personalRef}>
          <ProfileSectionCard
            title="Personal Details"
            description="Basic contact details."
            readonly
          >
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <div>
                <p className="text-xs text-ink-faint">Name</p>
                <p className="font-semibold text-ink">{profile?.full_name || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-ink-faint">Email</p>
                <p className="font-semibold text-ink">{profile?.email || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-ink-faint">Phone</p>
                <p className="font-semibold text-ink">{profile?.phone || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-ink-faint">Location</p>
                <p className="font-semibold text-ink">{profile?.location || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-ink-faint">Experience</p>
                <p className="font-semibold text-ink">
                  {profile?.total_experience_years || 0}y {profile?.total_experience_months || 0}m
                </p>
              </div>
              <div>
                <p className="text-xs text-ink-faint">Notice Period</p>
                <p className="font-semibold text-ink">
                  {profile?.notice_period_days ? `${profile.notice_period_days} days` : "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-ink-faint">Expected Salary</p>
                <p className="font-semibold text-ink">
                  {profile?.expected_salary ? `₹${profile.expected_salary}` : "-"}
                </p>
              </div>
            </div>
          </ProfileSectionCard>
        </div>
      </ProfileLayout>
    </div>
  );
}
