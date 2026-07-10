import {
  AlertCircle,
  BookmarkPlus,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Pencil,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

import {
  createOpportunity,
  deleteOpportunity,
  listOpportunities,
  updateOpportunity,
} from "../api/opportunities";
import { friendlyErrorMessage } from "../api/errors";
import type {
  EmploymentType,
  OpportunityPriority,
  OpportunitySource,
  OpportunityStatus,
  SavedOpportunity,
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
  const [opportunities, setOpportunities] = useState<SavedOpportunity[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<SavedOpportunity | null>(null);
  const [editState, setEditState] = useState({
    status: "wishlist" as OpportunityStatus,
    notes: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OpportunityStatus | "all">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    void loadOpportunities();
  }, []);

  const visibleOpportunities = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    return opportunities.filter((opportunity) => {
      const matchesStatus =
        statusFilter === "all" || opportunity.status === statusFilter;
      const matchesSearch =
        !normalizedSearch ||
        opportunity.company_name.toLowerCase().includes(normalizedSearch) ||
        opportunity.role_title.toLowerCase().includes(normalizedSearch) ||
        opportunity.location.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [opportunities, searchQuery, statusFilter]);

  const savedMetrics = useMemo(
    () => ({
      active: opportunities.filter(
        (opportunity) =>
          !["archived", "rejected"].includes(opportunity.status),
      ).length,
      interviews: opportunities.filter(
        (opportunity) => opportunity.status === "interview",
      ).length,
      highPriority: opportunities.filter(
        (opportunity) => opportunity.priority === "high",
      ).length,
    }),
    [opportunities],
  );

  async function loadOpportunities() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      setOpportunities(await listOpportunities());
    } catch (error) {
      setErrorMessage(
        friendlyErrorMessage(
          error,
          "Unable to load saved opportunities. Start the backend server and try again.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

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
      setOpportunities((current) => [opportunity, ...current]);
      setSuccessMessage(
        `${opportunity.role_title} at ${opportunity.company_name} was saved manually.`,
      );
      setFormState(initialFormState);
    } catch (error) {
      setErrorMessage(
        friendlyErrorMessage(
          error,
          "Unable to save this opportunity. Check the backend server and submitted details.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedOpportunity) return;

    setIsUpdating(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const updated = await updateOpportunity(selectedOpportunity.id, {
        status: editState.status,
        notes: editState.notes.trim() || null,
      });
      setOpportunities((current) =>
        current.map((opportunity) =>
          opportunity.id === updated.id ? updated : opportunity,
        ),
      );
      setSelectedOpportunity(updated);
      setSuccessMessage(`${updated.role_title} was updated.`);
    } catch (error) {
      setErrorMessage(
        friendlyErrorMessage(error, "Unable to update this opportunity."),
      );
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete(opportunity: SavedOpportunity) {
    const confirmed = window.confirm(
      `Delete ${opportunity.role_title} at ${opportunity.company_name}?`,
    );
    if (!confirmed) return;

    setErrorMessage("");
    setSuccessMessage("");

    try {
      await deleteOpportunity(opportunity.id);
      setOpportunities((current) =>
        current.filter((item) => item.id !== opportunity.id),
      );
      if (selectedOpportunity?.id === opportunity.id) {
        setSelectedOpportunity(null);
      }
      setSuccessMessage(`${opportunity.role_title} was deleted.`);
    } catch (error) {
      setErrorMessage(
        friendlyErrorMessage(error, "Unable to delete this opportunity."),
      );
    }
  }

  function openEdit(opportunity: SavedOpportunity) {
    setSelectedOpportunity(opportunity);
    setEditState({
      status: opportunity.status,
      notes: opportunity.notes ?? "",
    });
  }

  function validateForm() {
    if (!formState.companyName.trim()) return "Company name is required.";
    if (!formState.roleTitle.trim()) return "Role title is required.";
    if (!formState.jobUrl.trim()) return "Job URL is required.";
    if (!isValidUrl(formState.jobUrl)) {
      return "Job URL must be a valid http(s) URL copied from the job board.";
    }
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
          <span className="badge badge-accent">Manual opportunity workspace</span>
          <h1 id="saved-title">Save opportunities manually</h1>
          <p>
            After opening a generated external search link, return here and save
            the opportunity yourself. JobTrackr stores only the details you enter.
          </p>
          <div className="saved-hero-metrics" aria-label="Saved opportunity metrics">
            <div>
              <strong>{opportunities.length}</strong>
              <span>Total saved</span>
            </div>
            <div>
              <strong>{savedMetrics.active}</strong>
              <span>Active records</span>
            </div>
            <div>
              <strong>{savedMetrics.highPriority}</strong>
              <span>High priority</span>
            </div>
          </div>
        </div>
        <aside className="saved-policy card">
          <BriefcaseBusiness size={30} />
          <strong>Manual by design</strong>
          <span>No scraping, no imported listings, no automated applications.</span>
          <div className="saved-policy-list">
            <span>Company</span>
            <span>Role</span>
            <span>Status</span>
            <span>Notes</span>
          </div>
        </aside>
      </section>

      <section className="saved-workspace" aria-label="Manual opportunity saving">
        <form className="opportunity-form card" onSubmit={handleSubmit}>
          <div className="form-header">
            <span className="eyebrow">Manual save form</span>
            <h2>Add opportunity</h2>
            <p>
              Save only roles you found yourself. Required fields are company,
              role, source, job URL, and location.
            </p>
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
              helperText="Paste the original job board URL. JobTrackr stores it only for your manual tracking."
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
              helperText="Optional application deadline or follow-up date."
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
              helperText="Optional comma-separated skills for later review."
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

          <FeedbackMessages error={errorMessage} success={successMessage} />

          <button className="button button-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="spin-icon" size={18} />
            ) : (
              <BookmarkPlus size={18} />
            )}
            {isSubmitting ? "Saving..." : "Save opportunity"}
          </button>
        </form>

        <aside className="saved-panel card" aria-label="Saved opportunities summary">
          <span className="badge badge-teal">Workspace summary</span>
          <strong>{opportunities.length} saved opportunities</strong>
          <p>
            Manage real opportunities you entered manually. Search and status
            filters are client-side for this foundation.
          </p>
          <div className="saved-summary-grid" aria-label="Saved opportunity status summary">
            <div>
              <span>Interviews</span>
              <strong>{savedMetrics.interviews}</strong>
            </div>
            <div>
              <span>High priority</span>
              <strong>{savedMetrics.highPriority}</strong>
            </div>
          </div>
          <button className="button button-secondary" type="button" onClick={loadOpportunities}>
            <RefreshCw size={18} />
            Refresh list
          </button>
        </aside>
      </section>

      <section className="saved-list-section" aria-labelledby="saved-list-title">
        <div className="section-heading split-heading">
          <div>
            <span className="eyebrow">Opportunity board</span>
            <h2 id="saved-list-title">Saved opportunities</h2>
          </div>
          <p>
            This board only contains opportunities you manually enter. It does
            not import or scrape job board records.
          </p>
        </div>

        <div className="saved-toolbar card">
          <label className="field-group">
            <span>Search saved opportunities</span>
            <div className="input-with-icon">
              <Search size={18} />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search company, role, or location"
              />
            </div>
          </label>
          <label className="field-group">
            <span>Status filter</span>
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as OpportunityStatus | "all")
              }
            >
              <option value="all">All statuses</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {isLoading ? (
          <div className="empty-state card" aria-live="polite">
            <Loader2 className="spin-icon" size={28} />
            <strong>Loading saved opportunities</strong>
            <p>JobTrackr is reading your local saved opportunity records.</p>
          </div>
        ) : null}

        {!isLoading && opportunities.length === 0 ? (
          <div className="empty-state card">
            <BookmarkPlus size={28} />
            <strong>No saved opportunities yet</strong>
            <p>
              Use the form above after finding an opportunity through an
              external job board search.
            </p>
          </div>
        ) : null}

        {!isLoading && opportunities.length > 0 && visibleOpportunities.length === 0 ? (
          <div className="empty-state card">
            <Search size={28} />
            <strong>No opportunities match the current filter</strong>
            <p>Clear the search text or switch the status filter.</p>
          </div>
        ) : null}

        {!isLoading && visibleOpportunities.length > 0 ? (
          <div className="opportunity-grid">
            {visibleOpportunities.map((opportunity) => (
              <article className="opportunity-card card" key={opportunity.id}>
                <div className="opportunity-card-header">
                  <span className={`status-pill status-${opportunity.status}`}>
                    {labelFor(statusOptions, opportunity.status)}
                  </span>
                  <span className="source-pill">
                    {labelFor(sourceOptions, opportunity.source)}
                  </span>
                  <span className={`priority-pill priority-${opportunity.priority}`}>
                    {labelFor(priorityOptions, opportunity.priority)} priority
                  </span>
                </div>
                <div>
                  <h3>{opportunity.role_title}</h3>
                  <p>{opportunity.company_name}</p>
                </div>
                <dl className="opportunity-details">
                  <div>
                    <dt>Location</dt>
                    <dd>{opportunity.location}</dd>
                  </div>
                  <div>
                    <dt>Priority</dt>
                    <dd>{labelFor(priorityOptions, opportunity.priority)}</dd>
                  </div>
                  <div>
                    <dt>Updated</dt>
                    <dd>{formatDate(opportunity.updated_at)}</dd>
                  </div>
                  <div>
                    <dt>Deadline</dt>
                    <dd>
                      {opportunity.deadline
                        ? formatDate(opportunity.deadline)
                        : "Not set"}
                    </dd>
                  </div>
                </dl>
                {opportunity.required_skills.length > 0 ? (
                  <div className="chip-row">
                    {opportunity.required_skills.map((skill) => (
                      <span className="chip" key={skill}>
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="opportunity-card-footer">
                  <span>
                    <CalendarDays size={15} />
                    Created {formatDate(opportunity.created_at)}
                  </span>
                  <span>{labelFor(workTypeOptions, opportunity.work_type)}</span>
                </div>
                <div className="opportunity-actions">
                  <a
                    className="button button-secondary"
                    href={opportunity.job_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open job
                    <ExternalLink size={16} />
                  </a>
                  <button
                    className="icon-button"
                    type="button"
                    aria-label={`Edit ${opportunity.role_title}`}
                    onClick={() => openEdit(opportunity)}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    className="icon-button danger"
                    type="button"
                    aria-label={`Delete ${opportunity.role_title}`}
                    onClick={() => void handleDelete(opportunity)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      {selectedOpportunity ? (
        <section className="edit-panel card" aria-labelledby="edit-title">
          <div>
            <span className="eyebrow">Edit foundation</span>
            <h2 id="edit-title">{selectedOpportunity.role_title}</h2>
            <p>
              Update the current application status and notes. Full detail editing
              can grow from this foundation.
            </p>
            <div className="edit-summary">
              <span className={`status-pill status-${selectedOpportunity.status}`}>
                {labelFor(statusOptions, selectedOpportunity.status)}
              </span>
              <span className="source-pill">
                {labelFor(sourceOptions, selectedOpportunity.source)}
              </span>
            </div>
          </div>
          <form className="edit-form" onSubmit={handleUpdate}>
            <SelectField
              label="Edit status"
              value={editState.status}
              options={statusOptions}
              onChange={(status) => setEditState({ ...editState, status })}
            />
            <label className="field-group">
              <span>Edit notes</span>
              <textarea
                value={editState.notes}
                onChange={(event) =>
                  setEditState({ ...editState, notes: event.target.value })
                }
                rows={4}
              />
            </label>
            <div className="button-row">
              <button className="button button-primary" type="submit" disabled={isUpdating}>
                {isUpdating ? <Loader2 className="spin-icon" size={18} /> : <Pencil size={18} />}
                {isUpdating ? "Updating..." : "Update opportunity"}
              </button>
              <button
                className="button button-secondary"
                type="button"
                onClick={() => setSelectedOpportunity(null)}
              >
                Close
              </button>
            </div>
          </form>
        </section>
      ) : null}
    </main>
  );
}

function FeedbackMessages({ error, success }: { error: string; success: string }) {
  return (
    <div className="feedback-stack" aria-live="polite">
      {error ? (
        <div className="form-alert" role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      ) : null}

      {success ? (
        <div className="form-success" role="status">
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      ) : null}
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  helperText,
  required = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helperText?: string;
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
      {helperText ? <small>{helperText}</small> : null}
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
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function labelFor<TValue extends string>(
  options: Array<{ label: string; value: TValue }>,
  value: TValue,
) {
  return options.find((option) => option.value === value)?.label ?? value;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export default SavedPage;
