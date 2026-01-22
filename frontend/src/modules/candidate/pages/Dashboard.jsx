import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import CandidateLayout from "../../../layouts/CandidateLayout";
import Skeleton from "../../../components/ui/Skeleton";
import ProfileLayout from "../components/ProfileLayout";
import ProfileCompletionCard from "../components/ProfileCompletionCard";
import ResumeSection from "../components/sections/ResumeSection";
import SummarySection from "../components/sections/SummarySection";
import SkillsSection from "../components/sections/SkillsSection";
import EmploymentSection from "../components/sections/EmploymentSection";
import EducationSection from "../components/sections/EducationSection";
import ProjectsSection from "../components/sections/ProjectsSection";
import PersonalDetailsSection from "../components/sections/PersonalDetailsSection";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useCreateSkillMutation,
  useDeleteSkillMutation,
  useCreateEmploymentMutation,
  useUpdateEmploymentMutation,
  useDeleteEmploymentMutation,
  useCreateEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useUploadResumeMutation,
} from "../../../features/candidate/candidateProfileApi";

const parseOptionalInt = (value) => (value === "" || value === null ? null : Number(value));

export default function CandidateDashboard() {
  const { data, isLoading } = useGetProfileQuery();
  const profile = data?.profile;
  const skills = data?.skills ?? [];
  const employments = data?.employments ?? [];
  const educations = data?.educations ?? [];
  const projects = data?.projects ?? [];

  const [updateProfile] = useUpdateProfileMutation();
  const [createSkill] = useCreateSkillMutation();
  const [deleteSkill] = useDeleteSkillMutation();
  const [createEmployment] = useCreateEmploymentMutation();
  const [updateEmployment] = useUpdateEmploymentMutation();
  const [deleteEmployment] = useDeleteEmploymentMutation();
  const [createEducation] = useCreateEducationMutation();
  const [updateEducation] = useUpdateEducationMutation();
  const [deleteEducation] = useDeleteEducationMutation();
  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();
  const [uploadResume] = useUploadResumeMutation();

  const [activeSection, setActiveSection] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [personalForm, setPersonalForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    total_experience_years: 0,
    total_experience_months: 0,
    notice_period_days: "",
    expected_salary: "",
  });
  const [summaryForm, setSummaryForm] = useState("");
  const [skillsDraft, setSkillsDraft] = useState([]);
  const [employmentDraft, setEmploymentDraft] = useState([]);
  const [educationDraft, setEducationDraft] = useState([]);
  const [projectsDraft, setProjectsDraft] = useState([]);
  const [removedEmploymentIds, setRemovedEmploymentIds] = useState([]);
  const [removedEducationIds, setRemovedEducationIds] = useState([]);
  const [removedProjectIds, setRemovedProjectIds] = useState([]);

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

  useEffect(() => {
    if (profile) {
      setPersonalForm({
        full_name: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        location: profile.location || "",
        total_experience_years: profile.total_experience_years ?? 0,
        total_experience_months: profile.total_experience_months ?? 0,
        notice_period_days: profile.notice_period_days ?? "",
        expected_salary: profile.expected_salary ?? "",
      });
      setSummaryForm(profile.summary || "");
    }
  }, [profile]);

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

  const handleSavePersonal = async () => {
    try {
      await updateProfile({
        full_name: personalForm.full_name,
        email: personalForm.email,
        phone: personalForm.phone,
        location: personalForm.location,
        total_experience_years: Number(personalForm.total_experience_years || 0),
        total_experience_months: Number(personalForm.total_experience_months || 0),
        notice_period_days: parseOptionalInt(personalForm.notice_period_days),
        expected_salary: parseOptionalInt(personalForm.expected_salary),
      }).unwrap();
      toast.success("Personal details updated.");
      setActiveSection(null);
    } catch (err) {
      toast.error("Unable to update personal details.");
    }
  };

  const handleSaveSummary = async () => {
    try {
      await updateProfile({ summary: summaryForm }).unwrap();
      toast.success("Summary updated.");
      setActiveSection(null);
    } catch (err) {
      toast.error("Unable to update summary.");
    }
  };

  const beginSectionEdit = (section) => {
    if (activeSection && activeSection !== section) return;
    setActiveSection(section);
    if (section === "summary") {
      setSummaryForm(profile?.summary || "");
    }
    if (section === "personal") {
      setPersonalForm({
        full_name: profile?.full_name || "",
        email: profile?.email || "",
        phone: profile?.phone || "",
        location: profile?.location || "",
        total_experience_years: profile?.total_experience_years ?? 0,
        total_experience_months: profile?.total_experience_months ?? 0,
        notice_period_days: profile?.notice_period_days ?? "",
        expected_salary: profile?.expected_salary ?? "",
      });
    }
    if (section === "skills") {
      setSkillsDraft(skills.map((skill) => ({ ...skill })));
    }
    if (section === "employment") {
      setEmploymentDraft(employments.map((job) => ({ ...job })));
      setRemovedEmploymentIds([]);
    }
    if (section === "education") {
      setEducationDraft(educations.map((edu) => ({ ...edu })));
      setRemovedEducationIds([]);
    }
    if (section === "projects") {
      setProjectsDraft(projects.map((project) => ({ ...project })));
      setRemovedProjectIds([]);
    }
    if (section === "resume") {
      setResumeFile(null);
    }
  };

  const cancelSectionEdit = (section) => {
    setActiveSection(null);
    if (section === "summary") {
      setSummaryForm(profile?.summary || "");
    }
    if (section === "personal") {
      setPersonalForm({
        full_name: profile?.full_name || "",
        email: profile?.email || "",
        phone: profile?.phone || "",
        location: profile?.location || "",
        total_experience_years: profile?.total_experience_years ?? 0,
        total_experience_months: profile?.total_experience_months ?? 0,
        notice_period_days: profile?.notice_period_days ?? "",
        expected_salary: profile?.expected_salary ?? "",
      });
    }
    if (section === "skills") {
      setSkillsDraft([]);
    }
    if (section === "employment") {
      setEmploymentDraft([]);
      setRemovedEmploymentIds([]);
    }
    if (section === "education") {
      setEducationDraft([]);
      setRemovedEducationIds([]);
    }
    if (section === "projects") {
      setProjectsDraft([]);
      setRemovedProjectIds([]);
    }
    if (section === "resume") {
      setResumeFile(null);
    }
  };

  const handleSaveSkills = async () => {
    const draftIds = new Set(skillsDraft.filter((skill) => skill.id).map((skill) => skill.id));
    const toCreate = skillsDraft.filter((skill) => !skill.id);
    const toDelete = skills.filter((skill) => !draftIds.has(skill.id));

    try {
      await Promise.all([
        ...toCreate.map((skill) => createSkill({ name: skill.name }).unwrap()),
        ...toDelete.map((skill) => deleteSkill(skill.id).unwrap()),
      ]);
      toast.success("Skills updated.");
      setActiveSection(null);
    } catch (err) {
      toast.error("Unable to update skills.");
    }
  };

  const handleSaveEmployment = async () => {
    try {
      const createPayloads = employmentDraft.filter((item) => !item.id);
      const updatePayloads = employmentDraft.filter((item) => item.id && item._status === "updated");
      await Promise.all([
        ...createPayloads.map((item) =>
          createEmployment({
            ...item,
            end_date: item.is_current ? null : item.end_date || null,
          }).unwrap()
        ),
        ...updatePayloads.map((item) =>
          updateEmployment({
            id: item.id,
            ...item,
            end_date: item.is_current ? null : item.end_date || null,
          }).unwrap()
        ),
        ...removedEmploymentIds.map((id) => deleteEmployment(id).unwrap()),
      ]);
      toast.success("Employment updated.");
      setActiveSection(null);
    } catch (err) {
      toast.error("Unable to save employment.");
    }
  };

  const handleSaveEducation = async () => {
    try {
      const createPayloads = educationDraft.filter((item) => !item.id);
      const updatePayloads = educationDraft.filter((item) => item.id && item._status === "updated");
      await Promise.all([
        ...createPayloads.map((item) =>
          createEducation({
            ...item,
            start_year: Number(item.start_year || 0),
            end_year: Number(item.end_year || 0),
          }).unwrap()
        ),
        ...updatePayloads.map((item) =>
          updateEducation({
            id: item.id,
            ...item,
            start_year: Number(item.start_year || 0),
            end_year: Number(item.end_year || 0),
          }).unwrap()
        ),
        ...removedEducationIds.map((id) => deleteEducation(id).unwrap()),
      ]);
      toast.success("Education updated.");
      setActiveSection(null);
    } catch (err) {
      toast.error("Unable to save education.");
    }
  };

  const handleSaveProjects = async () => {
    try {
      const createPayloads = projectsDraft.filter((item) => !item.id);
      const updatePayloads = projectsDraft.filter((item) => item.id && item._status === "updated");
      await Promise.all([
        ...createPayloads.map((item) => createProject(item).unwrap()),
        ...updatePayloads.map((item) => updateProject({ id: item.id, ...item }).unwrap()),
        ...removedProjectIds.map((id) => deleteProject(id).unwrap()),
      ]);
      toast.success("Projects updated.");
      setActiveSection(null);
    } catch (err) {
      toast.error("Unable to save projects.");
    }
  };

  const handleSaveResume = async () => {
    if (!resumeFile) {
      toast.error("Select a resume file to upload.");
      return;
    }
    try {
      await uploadResume(resumeFile).unwrap();
      toast.success("Resume updated.");
      setActiveSection(null);
      setResumeFile(null);
    } catch (err) {
      toast.error("Unable to upload resume.");
    }
  };

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

        <ProfileLayout
          top={
            <div className="space-y-4">
              <ProfileCompletionCard
                percent={data?.profile_completion_percent ?? 0}
                lastUpdated={data?.last_updated}
                subtitle="Complete your profile to boost visibility."
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
                subtitle="Complete your profile to boost visibility."
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
          <div ref={sectionRefs.resume}>
            <ResumeSection
              resumeUrl={profile?.resume_url}
              selectedFile={resumeFile}
              onFileChange={setResumeFile}
              isEditing={activeSection === "resume"}
              isLocked={isLocked("resume")}
              onEdit={() => beginSectionEdit("resume")}
              onCancel={() => cancelSectionEdit("resume")}
              onSave={handleSaveResume}
            />
          </div>

          <div ref={sectionRefs.summary}>
            <SummarySection
              summary={profile?.summary}
              draft={summaryForm}
              onChange={setSummaryForm}
              isEditing={activeSection === "summary"}
              isLocked={isLocked("summary")}
              onEdit={() => beginSectionEdit("summary")}
              onCancel={() => cancelSectionEdit("summary")}
              onSave={handleSaveSummary}
            />
          </div>

          <div ref={sectionRefs.skills}>
            <SkillsSection
              skills={skills}
              draft={skillsDraft}
              setDraft={setSkillsDraft}
              isEditing={activeSection === "skills"}
              isLocked={isLocked("skills")}
              onEdit={() => beginSectionEdit("skills")}
              onCancel={() => cancelSectionEdit("skills")}
              onSave={handleSaveSkills}
            />
          </div>

          <div ref={sectionRefs.employment}>
            <EmploymentSection
              items={employments}
              draft={employmentDraft}
              setDraft={setEmploymentDraft}
              isEditing={activeSection === "employment"}
              isLocked={isLocked("employment")}
              onEdit={() => beginSectionEdit("employment")}
              onCancel={() => cancelSectionEdit("employment")}
              onSave={handleSaveEmployment}
              onRemoveExisting={(id) =>
                setRemovedEmploymentIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
              }
            />
          </div>

          <div ref={sectionRefs.education}>
            <EducationSection
              items={educations}
              draft={educationDraft}
              setDraft={setEducationDraft}
              isEditing={activeSection === "education"}
              isLocked={isLocked("education")}
              onEdit={() => beginSectionEdit("education")}
              onCancel={() => cancelSectionEdit("education")}
              onSave={handleSaveEducation}
              onRemoveExisting={(id) =>
                setRemovedEducationIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
              }
            />
          </div>

          <div ref={sectionRefs.projects}>
            <ProjectsSection
              items={projects}
              draft={projectsDraft}
              setDraft={setProjectsDraft}
              isEditing={activeSection === "projects"}
              isLocked={isLocked("projects")}
              onEdit={() => beginSectionEdit("projects")}
              onCancel={() => cancelSectionEdit("projects")}
              onSave={handleSaveProjects}
              onRemoveExisting={(id) =>
                setRemovedProjectIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
              }
            />
          </div>

          <div ref={sectionRefs.personal}>
            <PersonalDetailsSection
              profile={profile}
              draft={personalForm}
              setDraft={setPersonalForm}
              isEditing={activeSection === "personal"}
              isLocked={isLocked("personal")}
              onEdit={() => beginSectionEdit("personal")}
              onCancel={() => cancelSectionEdit("personal")}
              onSave={handleSavePersonal}
            />
          </div>
        </ProfileLayout>
      </div>
    </CandidateLayout>
  );
}
