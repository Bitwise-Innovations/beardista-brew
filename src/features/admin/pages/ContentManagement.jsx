import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import DataCard from "../components/DataCard";
import Pagination from "../components/Pagination";
import { usePagination } from "../components/usePageSize";
import EmptyState from "../components/EmptyState";
import AnnouncementsTab from "../components/announcements/AnnouncementsTab";
import { announcements as sampleAnnouncements } from "../data/announcementsMockData";
import { events as sampleEvents } from "../data/eventsMockData";
import { menu_items as sampleMenuItems } from "../data/menuMockData";

const initialTeam = [
  {
    id: 1,
    name: 'Aldren "Dren" Santos',
    role: "Lead Barista",
    description: "Specializes in espresso extraction and latte art."
  },
  {
    id: 2,
    name: 'Kimberly "Kim" Ramos',
    role: "Full-time",
    description: "Specializes in cold brew and signature beverages."
  },
  {
    id: 3,
    name: 'Joshua "Josh" Dela Cruz',
    role: "Barista",
    description: "Enjoys exploring single-origin coffee and pour-over."
  }
];

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-[#19244E] outline-none transition focus:border-[#E58422] focus:ring-2 focus:ring-orange-100";

const labelClass =
  "mb-2 block text-xs font-bold uppercase tracking-wide text-[#19244E]";

// "team" is 72px with just the icon on phones, and the same as "small" from 640px up.
function ImagePlaceholder({ label, size = "large" }) {
  const sizeClass = {
    large: "h-36 w-36",
    small: "h-24 w-24",
    team: "h-[72px] w-[72px] sm:h-24 sm:w-24",
  }[size];
  const iconOnlyOnPhone = size === "team";

  return (
    <div
      className={`flex shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 text-center ${sizeClass}`}
    >
      <span className={iconOnlyOnPhone ? "text-2xl sm:text-3xl" : "text-3xl"} aria-hidden="true">▧</span>
      <span className={`px-2 text-xs font-semibold text-gray-500 ${iconOnlyOnPhone ? "hidden sm:block" : ""}`}>
        {label}
      </span>
      <span className={`text-[10px] text-gray-400 ${iconOnlyOnPhone ? "hidden sm:block" : ""}`}>
        Image placeholder
      </span>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        className={inputClass}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function TextAreaField({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <textarea
        className={inputClass + " resize-y"}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function SectionCard({ title, description, footer, children }) {
  return (
    <DataCard
      title={title}
      description={description}
      footer={footer}
      bodyClassName="space-y-6 p-4 sm:p-6"
    >
      {children}
    </DataCard>
  );
}

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState("story");
  const [notice, setNotice] = useState("");
  const [story, setStory] = useState({
    motto: "Crafted with passion. Served with character.",
    founderName: "",
    founderTitle: "Founder & Visionary",
    founderBio: "",
    communityStory: ""
  });
  const [blend, setBlend] = useState({
    roast: "Medium-Dark Artisanal Roast",
    notes: "Dark cacao, toasted hazelnut, and a hint of spice.",
    origin: "Mt. Apo Arabica and Benguet Bourbon"
  });
  const [team, setTeam] = useState(initialTeam);
  const [announcements, setAnnouncements] = useState(sampleAnnouncements);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    role: "Barista",
    description: ""
  });

  const teamPager = usePagination(team);

  const updateStory = (key, value) =>
    setStory((current) => ({ ...current, [key]: value }));

  const updateBlend = (key, value) =>
    setBlend((current) => ({ ...current, [key]: value }));

  const tabs = [
    { id: "story", label: "Our Story & Founder", number: "01" },
    { id: "blend", label: "Coffee Specs", number: "02" },
    { id: "team", label: "Barista Team", number: "03" },
    { id: "announcements", label: "Announcements", number: "04" }
  ];

  const publishMock = () => {
    setNotice("Preview saved locally for this session. No data was published.");
  };

  const addMember = (event) => {
    event.preventDefault();

    if (!newMember.name.trim()) return;

    setTeam((current) => [
      ...current,
      { ...newMember, id: Date.now(), name: newMember.name.trim() }
    ]);

    setNewMember({ name: "", role: "Barista", description: "" });
    setShowAddForm(false);
    setNotice("Team member added to the local preview.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Content Management"
        description="Manage the story, coffee identity, and people behind Beardista Brew."
        actions={
          <button
            type="button"
            onClick={publishMock}
            className="min-h-11 rounded-xl bg-[#E58422] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#d47414] active:scale-[0.98]"
          >
            Publish Changes
          </button>
        }
      />

      {notice && (
        <div
          role="status"
          className="flex items-start justify-between gap-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-[#19244E]"
        >
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            className="font-bold text-gray-500 hover:text-gray-800"
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            aria-pressed={activeTab === tab.id}
            className={`flex min-h-11 items-center gap-3 rounded-2xl border px-3 py-2.5 text-left text-[#19244E] transition sm:p-4 ${
              activeTab === tab.id
                ? "border-[#E58422] bg-[#FFF3E7]"
                : "border-[#EAE5DF] bg-white hover:border-orange-300"
            }`}
          >
            <span
              className={`font-display hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold sm:flex ${
                activeTab === tab.id
                  ? "bg-[#E58422] text-white"
                  : "bg-[#F8F6F3] text-[#E58422]"
              }`}
            >
              {tab.number}
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-bold sm:text-sm">{tab.label}</span>
              <span className="mt-1 hidden text-xs text-gray-500 sm:block">
                {activeTab === tab.id ? "Currently editing" : "Edit section"}
              </span>
            </span>
          </button>
        ))}
      </div>

      {activeTab === "story" && (
        <SectionCard
          title="Brand Story & Founder"
          description="Manage the content displayed in the public About Us and Our Story sections."
        >
          <div className="flex flex-col items-start gap-5 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 sm:flex-row sm:items-center sm:p-5">
            <ImagePlaceholder label="Founder Portrait" />
            <div>
              <h3 className="font-bold text-[#19244E]">Owner / Visionary Portrait</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                A designated image frame for the founder portrait. Replace this
                placeholder with an image when the actual asset is ready.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Field
                label="Official Brand Motto"
                value={story.motto}
                onChange={(value) => updateStory("motto", value)}
                placeholder="Enter the brand motto"
              />
            </div>
            <Field
              label="Founder Name"
              value={story.founderName}
              onChange={(value) => updateStory("founderName", value)}
              placeholder="Enter founder name"
            />
            <Field
              label="Founder Title"
              value={story.founderTitle}
              onChange={(value) => updateStory("founderTitle", value)}
              placeholder="Enter founder title"
            />
            <div className="md:col-span-2">
              <TextAreaField
                label="Origins & Vision"
                value={story.founderBio}
                onChange={(value) => updateStory("founderBio", value)}
                placeholder="Tell the story behind Beardista Brew..."
              />
            </div>
            <div className="md:col-span-2">
              <TextAreaField
                label="Community Gratitude"
                value={story.communityStory}
                onChange={(value) => updateStory("communityStory", value)}
                placeholder="Share the café's appreciation for its community..."
              />
            </div>
          </div>
        </SectionCard>
      )}

      {activeTab === "blend" && (
        <SectionCard
          title="The Beardista Blend"
          description="Manage the coffee specifications shown on the public website."
        >
          <div className="flex flex-col items-start gap-4 rounded-2xl bg-orange-50/70 p-5 sm:flex-row sm:items-center">
            <ImagePlaceholder label="Coffee Blend" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#E58422]">
                Signature Coffee
              </p>
              <h3 className="mt-2 text-xl font-extrabold text-[#19244E]">
                The Beardista Blend
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Use this placeholder for the signature blend image.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <Field
              label="Roast Profile"
              value={blend.roast}
              onChange={(value) => updateBlend("roast", value)}
              placeholder="Enter roast profile"
            />
            <TextAreaField
              label="Flavor Notes"
              value={blend.notes}
              onChange={(value) => updateBlend("notes", value)}
              placeholder="Describe the coffee's flavor notes"
              rows={3}
            />
            <Field
              label="Origin"
              value={blend.origin}
              onChange={(value) => updateBlend("origin", value)}
              placeholder="Enter coffee origin"
            />
          </div>
        </SectionCard>
      )}

      {activeTab === "team" && (
        <SectionCard
          title="Barista Team Roster"
          description="Manage team member profiles and the descriptions shown on public story pages."
          footer={team.length > 0 && <Pagination {...teamPager} label="Team member pages" />}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-[#19244E]">
                Team Members
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {team.length} member{team.length === 1 ? "" : "s"} in this local preview
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm((current) => !current)}
              className="min-h-11 self-start rounded-xl bg-[#E58422] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#d47414]"
            >
              {showAddForm ? "Cancel" : "+ Add Barista"}
            </button>
          </div>

          {showAddForm && (
            <form
              onSubmit={addMember}
              className="space-y-4 rounded-2xl border border-orange-200 bg-orange-50/50 p-5"
            >
              <h3 className="font-bold text-[#19244E]">New Team Member</h3>
              <Field
                label="Name"
                value={newMember.name}
                onChange={(value) =>
                  setNewMember((current) => ({ ...current, name: value }))
                }
                placeholder="Enter team member name"
              />
              <div>
                <label className={labelClass}>Role</label>
                <select
                  className={inputClass}
                  value={newMember.role}
                  onChange={(event) =>
                    setNewMember((current) => ({
                      ...current,
                      role: event.target.value
                    }))
                  }
                >
                  <option>Barista</option>
                  <option>Lead Barista</option>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Senior Barista</option>
                  <option>Head Roaster</option>
                </select>
              </div>
              <TextAreaField
                label="Description"
                value={newMember.description}
                onChange={(value) =>
                  setNewMember((current) => ({
                    ...current,
                    description: value
                  }))
                }
                placeholder="Describe their role or specialty"
                rows={3}
              />
              <button
                type="submit"
                className="rounded-xl bg-[#19244E] px-5 py-3 text-sm font-bold text-white hover:bg-[#273875]"
              >
                Add to Team Roster
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {teamPager.pageItems.map((member) => {
              const memberNumber = String(team.indexOf(member) + 1).padStart(2, "0");
              const badgeClass =
                "rounded-lg bg-[#FFF3E7] px-2 py-1 text-xs font-bold text-[#B96916]";
              const removeButtonClass =
                "min-h-11 rounded-lg px-2 text-sm font-bold text-gray-400 hover:bg-red-50 hover:text-red-600";
              const removeMember = () => {
                setTeam((current) => current.filter((item) => item.id !== member.id));
                setNotice("Team member removed from the local preview.");
              };

              return (
              <article
                key={member.id}
                className="space-y-4 rounded-2xl border border-[#EAE5DF] p-4 transition hover:border-orange-200 sm:p-5"
              >
                {/* Phones: photo, then badge + Remove, then name and role at full width. 640px and up: one row. */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                  <ImagePlaceholder label="Team Photo" size="team" />

                  <div className="flex items-center justify-between gap-3 sm:hidden">
                    <span className={badgeClass}>MEMBER {memberNumber}</span>
                    <button
                      type="button"
                      onClick={removeMember}
                      className={removeButtonClass}
                      aria-label={`Remove ${member.name}`}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className={`hidden sm:inline-block ${badgeClass}`}>
                      MEMBER {memberNumber}
                    </span>
                    <h3 className="break-normal text-sm font-extrabold text-[#19244E] sm:mt-2 sm:break-words sm:text-base">
                      {member.name}
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-gray-500">
                      {member.role}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={removeMember}
                    className={`hidden sm:block ${removeButtonClass}`}
                    aria-label={`Remove ${member.name}`}
                    title="Remove team member"
                  >
                    Remove
                  </button>
                </div>
                <TextAreaField
                  label="Description"
                  value={member.description}
                  onChange={(value) =>
                    setTeam((current) =>
                      current.map((item) =>
                        item.id === member.id
                          ? { ...item, description: value }
                          : item
                      )
                    )
                  }
                  placeholder="Enter a short team member description"
                  rows={3}
                />
              </article>
              );
            })}
          </div>

          {team.length === 0 && (
            <EmptyState
              className="rounded-2xl border border-dashed border-gray-300"
              title="No baristas on the roster yet."
              message="Use Add Barista to introduce the crew behind the counter."
            />
          )}
        </SectionCard>
      )}

      {activeTab === "announcements" && (
        <AnnouncementsTab
          announcements={announcements}
          setAnnouncements={setAnnouncements}
          events={sampleEvents}
          menuItems={sampleMenuItems}
          notify={setNotice}
        />
      )}
    </div>
  );
}
