import { AlertCircle, BookmarkPlus, CheckCircle2, Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";

import { createOpportunity } from "../api/opportunities";
import type {
  EmploymentType,
  OpportunityPriority,
  OpportunitySource,
  OpportunityStatus,
  SavedOpportunityCreate,
  WorkType,
} from "../types/opportunity";

const sourceOptions: Array<{ label: string; value: OpportunitySource }> = [
  { label: "LinkedIn", value: "linkedin" },
  { label: "JobStreet Indonesia", value: "jobstreet_indonesia" },
  { label: "Glints", value: "glints" },
  { label: "Karir.com", value: "karir" },
  { label: "Dealls", value: "dealls" },
  { label: "Other", value: "other" },
];

const workTypeOptions: Array<{ label: string; value: WorkType }> = [
  { label: "Unknown", value: "unknown" },
  { label: "Remote", value: "remote" },
  { label: "Hybrid", value: "hybrid" },
  { label: "On-site", value: "on_site" },
];

const employmentTypeOptions: Array<{ label: string; value: EmploymentType }> = [
  { label: "Unknown", value: "unknown" },
  { label: "Internship", value: "internship" },
  { label: "Full-time", value: "full_time" },
  { label: "Part-time", value: "part_time" },
  { label: "Contract", value: "contract" },
  { label: "Freelance", value: "freelance" },
];

const statusOptions: Array<{ label: string; value: OpportunityStatus }> = [
  { label: "Wishlist", value: "wishlist" },
  { label: "Applied", value: "applied" },
  { label: "Screening", value: "screening" },
  { label: "Interview", value: "interview" },
  { label: "Offer", value: "offer" },
  { label: "Rejected", value: "rejected" },
  { label: "Archived", value: "archived" },
];

const priorityOptions: Array<{ label: string; value: OpportunityPriority }> = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const initialFormState = {
  companyName: "",
  roleTitle: "",
  source: "linkedin" as OpportunitySource,
  jobUrl: "",
  location: "",
  workType: "unknown" as WorkType,
  employmentType: "unknown" as EmploymentType,
  status: "wishlist" as OpportunityStatus,
  priority: "medium" as OpportunityPriority,
  deadline: "",
  salaryRange: "",
  requiredSkills: "",
  notes: "",
};

function SavedPage() {
  const [formState, setFormState] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const validationMessage = validateForm();
    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      const opportunity = await createOpportunity(buildPayload());
      setSuccessMessage(
        `${opportunity.role_title} at ${opportunity.company_name} was saved manually.`,
      );
      setFormState(initialFormState);
    } catch {
      setErrorMessage(
        "Unable to save this opportunity. Check the backend server and submitted details.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function validateForm() {
    if (!formState.companyName.trim()) return "Company name is required.";
    if (!formState.roleTitle.trim()) return "Role title is required.";
    if (!formState.jobUrl.trim()) return "Job URL is required.";
    if (!isValidUrl(formState.jobUrl)) return "Job URL must be a valid URL.";
    if (!formState.location.trim()) return "Location is required.";
    return "";
  }

  function buildPayload(): SavedOpportunityCreate {
    return {
      company_name: formState.companyName.trim(),
      role_title: formState.roleTitle.trim(),
      source: formState.source,
      job_url: formState.jobUrl.trim(),
      location: formState.location.trim(),
      work_type: formState.workType,
      employment_type: formState.employmentType,
      status: formState.status,
      priority: formState.priority,
      deadline: formState.deadline || null,
      salary_range: formState.salaryRange.trim() || null,
      required_skills: parseListInput(formState.requiredSkills),
      notes: formState.notes.trim() || null,
    };
  }

  return (
    <main className="page-shell">
      <section className="saved-hero" aria-labelledby="saved-title">
        <div>
          <span className="badge badge-accent">JT-0003 active workflow</span>
          <h1 id="saved-title">Save opportunities manually</h1>
          <p>
            After opening a generated external search link, return here and save
            the opportunity yourself. JobTrackr stores only the details you enter.
          </p>
        </div>
        <aside className="saved-policy card">
          <BookmarkPlus size={30} />
          <strong>Manual by design</strong>
          <span>No scraping, no imported listings, no automated applications.</span>
        </aside>
      </section>

      <section className="saved-workspace" aria-label="Manual opportunity saving">
        <form className="opportunity-form card" onSubmit={handleSubmit}>
          <div className="form-header">
            <span className="eyebrow">Manual save form</span>
            <h2>Add opportunity</h2>
            <p>Required fields are company, role, source, job URL, and location.</p>
          </div>

          <div className="form-grid">
            <TextField
              label="Company name"
              value={formState.companyName}
              onChange={(companyName) => setFormState({ ...formState, companyName })}
              placeholder="Acme Indonesia"
              required
            />
            <TextField
              label="Role title"
              value={formState.roleTitle}
              onChange={(roleTitle) => setFormState({ ...formState, roleTitle })}
              placeholder="Frontend Developer"
              required
            />
            <SelectField
              label="Source"
              value={formState.source}
              options={sourceOptions}
              onChange={(source) => setFormState({ ...formState, source })}
            />
            <TextField
              label="Job URL"
              value={formState.jobUrl}
              onChange={(jobUrl) => setFormState({ ...formState, jobUrl })}
              placeholder="https://example.com/jobs/frontend"
              required
            />
            <TextField
              label="Location"
              value={formState.location}
              onChange={(location) => setFormState({ ...formState, location })}
              placeholder="Jakarta"
              required
            />
            <SelectField
              label="Work type"
              value={formState.workType}
              options={workTypeOptions}
              onChange={(workType) => setFormState({ ...formState, workType })}
            />
            <SelectField
              label="Employment type"
              value={formState.employmentType}
              options={employmentTypeOptions}
              onChange={(employmentType) =>
                setFormState({ ...formState, employmentType })
              }
            />
            <SelectField
              label="Status"
              value={formState.status}
              options={statusOptions}
              onChange={(status) => setFormState({ ...formState, status })}
            />
            <SelectField
              label="Priority"
              value={formState.priority}
              options={priorityOptions}
              onChange={(priority) => setFormState({ ...formState, priority })}
            />
            <TextField
              label="Deadline"
              value={formState.deadline}
              onChange={(deadline) => setFormState({ ...formState, deadline })}
              type="date"
            />
            <TextField
              label="Salary range"
              value={formState.salaryRange}
              onChange={(salaryRange) => setFormState({ ...formState, salaryRange })}
              placeholder="IDR 7M - 10M"
            />
            <TextField
              label="Required skills"
              value={formState.requiredSkills}
              onChange={(requiredSkills) =>
                setFormState({ ...formState, requiredSkills })
              }
              placeholder="React, TypeScript, SQL"
            />
          </div>

          <label className="field-group">
            <span>Notes</span>
            <textarea
              value={formState.notes}
              onChange={(event) =>
                setFormState({ ...formState, notes: event.target.value })
              }
              placeholder="Add context, recruiter notes, application plan, or follow-up reminders."
              rows={5}
            />
          </label>

          {errorMessage ? (
            <div className="form-alert" role="alert">
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          ) : null}

          {successMessage ? (
            <div className="form-success" role="status">
              <CheckCircle2 size={18} />
              <span>{successMessage}</span>
            </div>
          ) : null}

          <button className="button button-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="spin-icon" size={18} />
            ) : (
              <BookmarkPlus size={18} />
            )}
            {isSubmitting ? "Saving..." : "Save opportunity"}
          </button>
        </form>

        <aside className="saved-empty card" aria-label="Saved opportunities state">
          <span className="badge badge-teal">Saved list</span>
          <strong>No saved opportunities loaded yet</strong>
          <p>
            The management list arrives next in JT-0003. This form already saves
            real user-entered opportunities into the local SQLite-backed API.
          </p>
        </aside>
      </section>
    </main>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="field-group">
      <span>
        {label}
        {required ? <em>Required</em> : null}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
      />
    </label>
  );
}

function SelectField<TValue extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: TValue;
  options: Array<{ label: string; value: TValue }>;
  onChange: (value: TValue) => void;
}) {
  return (
    <label className="field-group">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value as TValue)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function parseListInput(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export default SavedPage;
