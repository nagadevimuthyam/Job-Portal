import { useRef, useState } from "react";
import CandidateLayout from "../../../layouts/CandidateLayout";
import Skeleton from "../../../components/ui/Skeleton";
import ProfileLayout from "../components/ProfileLayout";
import CandidateProfileBanner from "../components/CandidateProfileBanner";
import ResumeSection from "../components/sections/ResumeSection";
import SummarySection from "../components/sections/SummarySection";
import SkillsSection from "../components/sections/SkillsSection";
import EmploymentSection from "../components/sections/EmploymentSection";
import EducationSection from "../components/sections/EducationSection";
import ProjectsSection from "../components/sections/ProjectsSection";
import PersonalDetailsSection from "../components/sections/PersonalDetailsSection";
import { useGetProfileQuery } from "../../../features/candidate/candidateProfileApi";

export default function CandidateDashboard() {
  const { data, isLoading } = useGetProfileQuery();
  const profile = data?.profile;
  const skills = data?.skills ?? [];
  const employments = data?.employments ?? [];
  const educations = data?.educations ?? [];
  const projects = data?.projects ?? [];

  const [activeSection, setActiveSection] = useState(null);

  const resumeRef = useRef(null);
  const summaryRef = useRef(null);
  const skillsRef = useRef(null);
  const employmentRef = useRef(null);
  const educationRef = useRef(null);
  const projectsRef = useRef(null);
  const personalRef = useRef(null);

  const sectionRefs = {
    resume: resumeRef,
    summary: summaryRef,
    skills: skillsRef,
    employment: employmentRef,
    education: educationRef,
    projects: projectsRef,
    personal: personalRef,
  };

  const quickLinks = [
    { id: "resume", label: "Resume" },
    { id: "summary", label: "Summary" },
    { id: "skills", label: "Key Skills" },
    { id: "employment", label: "Employment" },
    { id: "education", label: "Education" },
    { id: "projects", label: "Projects" },
    { id: "personal", label: "Personal Details" },
  ];

  const isLocked = (section) => activeSection && activeSection !== section;

  const handleQuickLink = (id) => {
    sectionRefs[id]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCloseSection = () => setActiveSection(null);

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <CandidateLayout>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Candidate Dashboard</h1>
          <p className="text-sm text-ink-faint">Polish every section for a premium profile.</p>
        </div>

        <CandidateProfileBanner onJumpToSection={handleQuickLink} />

        <ProfileLayout
          top={
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
          }
          sidebar={
            <div className="space-y-4 lg:sticky lg:top-24">
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
          <div ref={sectionRefs.resume}>
            <ResumeSection
              resumeUrl={profile?.resume_url}
              resumeFilename={profile?.resume_filename}
              lastUpdated={profile?.last_updated}
              isEditing={activeSection === "resume"}
              isLocked={isLocked("resume")}
              onEdit={() => setActiveSection("resume")}
              onClose={handleCloseSection}
            />
          </div>

          <div ref={sectionRefs.summary}>
            <SummarySection
              summary={profile?.summary || ""}
              isEditing={activeSection === "summary"}
              isLocked={isLocked("summary")}
              onEdit={() => setActiveSection("summary")}
              onClose={handleCloseSection}
            />
          </div>

          <div ref={sectionRefs.skills}>
            <SkillsSection
              skills={skills}
              isEditing={activeSection === "skills"}
              isLocked={isLocked("skills")}
              onEdit={() => setActiveSection("skills")}
              onClose={handleCloseSection}
            />
          </div>

          <div ref={sectionRefs.employment}>
            <EmploymentSection
              items={employments}
              isEditing={activeSection === "employment"}
              isLocked={isLocked("employment")}
              onEdit={() => setActiveSection("employment")}
              onClose={handleCloseSection}
            />
          </div>

          <div ref={sectionRefs.education}>
            <EducationSection
              items={educations}
              isEditing={activeSection === "education"}
              isLocked={isLocked("education")}
              onEdit={() => setActiveSection("education")}
              onClose={handleCloseSection}
            />
          </div>

          <div ref={sectionRefs.projects}>
            <ProjectsSection
              items={projects}
              isEditing={activeSection === "projects"}
              isLocked={isLocked("projects")}
              onEdit={() => setActiveSection("projects")}
              onClose={handleCloseSection}
            />
          </div>

          <div ref={sectionRefs.personal}>
            <PersonalDetailsSection
              isEditing={activeSection === "personal"}
              isLocked={isLocked("personal")}
              onEdit={() => setActiveSection("personal")}
              onClose={handleCloseSection}
            />
          </div>
        </ProfileLayout>
      </div>
    </CandidateLayout>
  );
}
