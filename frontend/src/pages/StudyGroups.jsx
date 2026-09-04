import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Link2,
  Loader2,
  MessageCircle,
  Plus,
  Send,
  Target,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";

const emptyForm = {
  name: "",
  subject: "",
  description: "",
};

const StudyGroups = () => {
  const { user } = useAuth();

  // =========================================================
  // GROUP STATES
  // =========================================================
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [membershipLoading, setMembershipLoading] = useState(null);

  // =========================================================
  // GROUP CONTENT STATES
  // =========================================================
  const [resources, setResources] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [contentLoading, setContentLoading] = useState(false);

  // =========================================================
  // RESOURCE FORM
  // =========================================================
  const [resourceForm, setResourceForm] = useState({
    title: "",
    url: "",
    description: "",
  });
  const [resourceLoading, setResourceLoading] = useState(false);
  const [deletingResource, setDeletingResource] = useState(null);

  // =========================================================
  // TASK FORM
  // =========================================================
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [taskLoading, setTaskLoading] = useState(false);
  const [togglingTask, setTogglingTask] = useState(null);

  // =========================================================
  // DISCUSSION FORM
  // =========================================================
  const [discussionText, setDiscussionText] = useState("");
  const [discussionLoading, setDiscussionLoading] = useState(false);

  // =========================================================
  // GROUP SEARCH
  // =========================================================
  const [groupSearch, setGroupSearch] = useState("");

  // =========================================================
  // LOAD GROUPS
  // =========================================================
  const load = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/groups");

      setGroups(data);

      if (selectedGroup) {
        const updatedGroup = data.find(
          (group) => group._id === selectedGroup._id
        );

        if (updatedGroup) {
          setSelectedGroup(updatedGroup);
        }
      }
    } catch (error) {
      console.error("Error loading groups:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // =========================================================
  // MEMBERSHIP
  // =========================================================
  const isMember = (group) => {
    return group.members?.some(
      (member) => member._id === user?._id
    );
  };

  const myGroups = useMemo(
    () => groups.filter((group) => isMember(group)),
    [groups, user]
  );

  const filteredGroups = useMemo(() => {
    const search = groupSearch.trim().toLowerCase();

    if (!search) return groups;

    return groups.filter((group) =>
      `${group.name} ${group.subject} ${group.description || ""}`
        .toLowerCase()
        .includes(search)
    );
  }, [groups, groupSearch]);

  // =========================================================
  // LOAD GROUP CONTENT
  // =========================================================
  const loadGroupContent = async (groupId) => {
    if (!groupId) return;

    try {
      setContentLoading(true);

      const [resourcesRes, tasksRes, discussionsRes] =
        await Promise.all([
          api.get(`/groups/${groupId}/resources`),
          api.get(`/groups/${groupId}/tasks`),
          api.get(`/groups/${groupId}/discussions`),
        ]);

      setResources(resourcesRes.data || []);
      setTasks(tasksRes.data || []);
      setDiscussions(discussionsRes.data || []);
    } catch (error) {
      console.error(
        "Error loading group content:",
        error.response?.data || error.message
      );

      setResources([]);
      setTasks([]);
      setDiscussions([]);
    } finally {
      setContentLoading(false);
    }
  };

  // =========================================================
  // OPEN GROUP
  // =========================================================
  const openGroup = async (group) => {
    setSelectedGroup(group);
    setActiveTab("overview");
    await loadGroupContent(group._id);
  };

  // =========================================================
  // CREATE GROUP
  // =========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.subject.trim()) return;

    try {
      setCreatingGroup(true);

      await api.post("/groups", {
        ...form,
        name: form.name.trim(),
        subject: form.subject.trim(),
        description: form.description.trim(),
      });

      setForm(emptyForm);
      await load();
    } catch (error) {
      console.error(
        "Error creating group:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to create group"
      );
    } finally {
      setCreatingGroup(false);
    }
  };

  // =========================================================
  // JOIN / LEAVE GROUP
  // =========================================================
  const toggleMembership = async (group) => {
    try {
      setMembershipLoading(group._id);

      if (isMember(group)) {
        await api.post(`/groups/${group._id}/leave`);

        if (selectedGroup?._id === group._id) {
          setSelectedGroup(null);
          setResources([]);
          setTasks([]);
          setDiscussions([]);
        }

        await load();
      } else {
        await api.post(`/groups/${group._id}/join`);

        const { data } = await api.get("/groups");

        setGroups(data);

        const updatedGroup = data.find(
          (g) => g._id === group._id
        );

        if (updatedGroup) {
          setSelectedGroup(updatedGroup);
          setActiveTab("overview");
          await loadGroupContent(updatedGroup._id);
        }
      }
    } catch (error) {
      console.error(
        "Error updating membership:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to update group membership"
      );
    } finally {
      setMembershipLoading(null);
    }
  };

  // =========================================================
  // RESOURCE FUNCTIONS
  // =========================================================
  const addResource = async (e) => {
    e.preventDefault();

    if (
      !resourceForm.title.trim() ||
      !resourceForm.url.trim()
    ) {
      alert("Please enter resource title and URL");
      return;
    }

    try {
      setResourceLoading(true);

      const { data } = await api.post(
        `/groups/${selectedGroup._id}/resources`,
        {
          ...resourceForm,
          title: resourceForm.title.trim(),
          url: resourceForm.url.trim(),
          description: resourceForm.description.trim(),
        }
      );

      setResources((prev) => [data, ...prev]);

      setResourceForm({
        title: "",
        url: "",
        description: "",
      });
    } catch (error) {
      console.error(
        "Error adding resource:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to add resource"
      );
    } finally {
      setResourceLoading(false);
    }
  };

  const deleteResource = async (resourceId) => {
    try {
      setDeletingResource(resourceId);

      await api.delete(
        `/groups/${selectedGroup._id}/resources/${resourceId}`
      );

      setResources((prev) =>
        prev.filter(
          (resource) => resource._id !== resourceId
        )
      );
    } catch (error) {
      console.error(
        "Error deleting resource:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete resource"
      );
    } finally {
      setDeletingResource(null);
    }
  };

  // =========================================================
  // DISCUSSION FUNCTIONS
  // =========================================================
  const addDiscussion = async (e) => {
    e.preventDefault();

    if (!discussionText.trim()) {
      alert("Please enter a discussion message");
      return;
    }

    try {
      setDiscussionLoading(true);

      const { data } = await api.post(
        `/groups/${selectedGroup._id}/discussions`,
        {
          content: discussionText.trim(),
        }
      );

      setDiscussions((prev) => [data, ...prev]);
      setDiscussionText("");
    } catch (error) {
      console.error(
        "Error posting discussion:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to post discussion"
      );
    } finally {
      setDiscussionLoading(false);
    }
  };

  // =========================================================
  // TASK FUNCTIONS
  // =========================================================
  const addTask = async (e) => {
    e.preventDefault();

    if (!taskForm.title.trim()) {
      alert("Please enter task title");
      return;
    }

    try {
      setTaskLoading(true);

      const { data } = await api.post(
        `/groups/${selectedGroup._id}/tasks`,
        {
          ...taskForm,
          title: taskForm.title.trim(),
          description: taskForm.description.trim(),
        }
      );

      setTasks((prev) => [data, ...prev]);

      setTaskForm({
        title: "",
        description: "",
        dueDate: "",
      });
    } catch (error) {
      console.error(
        "Error adding task:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to add task"
      );
    } finally {
      setTaskLoading(false);
    }
  };

  const toggleTask = async (taskId) => {
    try {
      setTogglingTask(taskId);

      const { data } = await api.post(
        `/groups/${selectedGroup._id}/tasks/${taskId}/toggle`
      );

      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? data : task
        )
      );
    } catch (error) {
      console.error(
        "Error updating task:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to update task"
      );
    } finally {
      setTogglingTask(null);
    }
  };

  // =========================================================
  // CHECK TASK COMPLETION
  // =========================================================
  const isTaskCompleted = (task) => {
    return task.completedBy?.some((member) => {
      const memberId =
        typeof member === "object"
          ? member._id
          : member;

      return memberId === user?._id;
    });
  };

  const completedTasks = tasks.filter(isTaskCompleted).length;

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: BookOpen,
    },
    {
      id: "resources",
      label: "Resources",
      icon: FileText,
    },
    {
      id: "discussion",
      label: "Discussion",
      icon: MessageCircle,
    },
    {
      id: "tasks",
      label: "Tasks",
      icon: Target,
    },
    {
      id: "members",
      label: "Members",
      icon: Users,
    },
  ];

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <Layout
      title="Study Groups"
      subtitle="Collaborate, share resources and learn together."
    >
      <div className="mx-auto w-full max-w-[1440px] space-y-5">
        {/* ===================================================
            TOP HERO
            =================================================== */}
        <section className="relative overflow-hidden rounded-2xl border border-border-default bg-surface shadow-sm">
          <div
            className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative flex flex-col gap-5 px-5 py-6 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-600 dark:text-amber-400">
                <Users size={25} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-xl font-semibold text-primary-text sm:text-2xl">
                    Learn together
                  </h2>

                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
                    <UserPlus size={11} />
                    Community
                  </span>
                </div>

                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-secondary">
                  Find classmates with similar goals, exchange useful
                  resources, discuss difficult topics and stay accountable.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-xl bg-surface-muted px-4 py-3 text-center">
                <p className="text-lg font-bold text-primary-text">
                  {groups.length}
                </p>
                <p className="text-[10px] text-secondary">Groups</p>
              </div>

              <div className="rounded-xl bg-surface-muted px-4 py-3 text-center">
                <p className="text-lg font-bold text-primary-text">
                  {myGroups.length}
                </p>
                <p className="text-[10px] text-secondary">Joined</p>
              </div>

              <div className="rounded-xl bg-surface-muted px-4 py-3 text-center">
                <p className="text-lg font-bold text-primary-text">
                  {resources.length}
                </p>
                <p className="text-[10px] text-secondary">Resources</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            WORKSPACE / DISCOVERY
            =================================================== */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">
          {/* =================================================
              LEFT PANEL
              ================================================= */}
          <aside className="space-y-5 xl:col-span-1">
            {/* Create group */}
            <form
              onSubmit={handleSubmit}
              className="card"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Plus size={18} />
                </div>

                <div>
                  <h2 className="font-display text-lg font-semibold text-primary-text">
                    Start a study group
                  </h2>

                  <p className="text-[11px] text-secondary">
                    Bring learners together
                  </p>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="group-name" className="label">
                  Group name
                </label>

                <input
                  id="group-name"
                  required
                  className="input-field"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="DSA Warriors"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="group-subject" className="label">
                  Subject
                </label>

                <input
                  id="group-subject"
                  required
                  className="input-field"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      subject: e.target.value,
                    })
                  }
                  placeholder="Data Structures"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="group-description" className="label">
                  Description
                </label>

                <textarea
                  id="group-description"
                  className="input-field resize-none"
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder="What will this group focus on?"
                />
              </div>

              <button
                type="submit"
                disabled={creatingGroup}
                className="btn-accent flex w-full items-center justify-center gap-2"
              >
                {creatingGroup ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Create Group
                  </>
                )}
              </button>
            </form>

            {/* My groups */}
            <div className="card">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-semibold text-primary-text">
                    My study groups
                  </h2>

                  <p className="mt-0.5 text-[11px] text-secondary">
                    Your active communities
                  </p>
                </div>

                <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[10px] font-bold text-secondary">
                  {myGroups.length}
                </span>
              </div>

              <div className="space-y-2">
                {myGroups.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border-default bg-surface-muted/40 px-3 py-6 text-center">
                    <Users
                      size={20}
                      className="mx-auto text-secondary"
                    />

                    <p className="mt-2 text-xs font-medium text-primary-text">
                      No groups yet
                    </p>

                    <p className="mt-1 text-[10px] leading-relaxed text-secondary">
                      Join a group or create one to start collaborating.
                    </p>
                  </div>
                )}

                {myGroups.map((group) => (
                  <button
                    key={group._id}
                    type="button"
                    onClick={() => openGroup(group)}
                    className={`
                      group flex w-full items-center gap-3
                      rounded-xl border p-3 text-left
                      transition-all duration-150
                      ${
                        selectedGroup?._id === group._id
                          ? "border-amber-400/60 bg-amber-400/10"
                          : "border-transparent bg-surface-muted/40 hover:border-border-default hover:bg-surface-muted"
                      }
                    `}
                  >
                    <div
                      className={`
                        flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
                        ${
                          selectedGroup?._id === group._id
                            ? "bg-amber-400/20 text-amber-600 dark:text-amber-400"
                            : "bg-surface text-secondary"
                        }
                      `}
                    >
                      <BookOpen size={16} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-primary-text">
                        {group.name}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-secondary">
                        {group.subject}
                      </p>
                    </div>

                    <ChevronRight
                      size={14}
                      className="shrink-0 text-secondary transition-transform group-hover:translate-x-0.5"
                    />
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* =================================================
              MAIN CONTENT
              ================================================= */}
          <main className="min-w-0 xl:col-span-3">
            {/* =================================================
                NO GROUP SELECTED
                ================================================= */}
            {!selectedGroup && (
              <div className="space-y-5">
                <section className="relative overflow-hidden rounded-2xl border border-border-default bg-surface shadow-sm">
                  <div
                    className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl"
                    aria-hidden="true"
                  />

                  <div className="relative flex flex-col items-center px-5 py-12 text-center sm:px-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-600 dark:text-amber-400">
                      <Users size={30} />
                    </div>

                    <h2 className="mt-5 font-display text-2xl font-semibold text-primary-text">
                      Find your study community
                    </h2>

                    <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-secondary">
                      Join students who are working towards similar goals.
                      Share knowledge, ask questions and make progress
                      together.
                    </p>

                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                      {[
                        "Share resources",
                        "Discuss concepts",
                        "Track group goals",
                      ].map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1.5 text-[10px] font-medium text-secondary"
                        >
                          <CheckCircle2
                            size={12}
                            className="text-emerald-500"
                          />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Available groups */}
                <section>
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="font-display text-xl font-semibold text-primary-text">
                        Available study groups
                      </h2>

                      <p className="mt-1 text-xs text-secondary">
                        Explore communities and find one that fits your goals.
                      </p>
                    </div>

                    {groups.length > 0 && (
                      <div className="relative">
                        <input
                          value={groupSearch}
                          onChange={(e) =>
                            setGroupSearch(e.target.value)
                          }
                          placeholder="Search groups..."
                          className="input-field w-full sm:w-56"
                        />
                      </div>
                    )}
                  </div>

                  {loading ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {[1, 2, 3, 4].map((item) => (
                        <div
                          key={item}
                          className="h-48 animate-pulse rounded-2xl border border-border-default bg-surface-muted"
                        />
                      ))}
                    </div>
                  ) : filteredGroups.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border-default bg-surface p-10 text-center">
                      <Users
                        size={24}
                        className="mx-auto text-secondary"
                      />

                      <p className="mt-3 text-sm font-semibold text-primary-text">
                        {groups.length === 0
                          ? "No study groups available"
                          : "No groups match your search"}
                      </p>

                      <p className="mt-1 text-xs text-secondary">
                        {groups.length === 0
                          ? "Create the first study group and invite your classmates."
                          : "Try searching for another subject or group name."}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {filteredGroups.map((group) => {
                        const member = isMember(group);

                        return (
                          <article
                            key={group._id}
                            className="group relative overflow-hidden rounded-2xl border border-border-default bg-surface p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-400/50 hover:shadow-md"
                          >
                            <div
                              className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-amber-400/5 transition-colors group-hover:bg-amber-400/10"
                              aria-hidden="true"
                            />

                            <div className="relative">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/15 text-amber-600 dark:text-amber-400">
                                  <BookOpen size={18} />
                                </div>

                                {member && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                                    <Check size={11} />
                                    Joined
                                  </span>
                                )}
                              </div>

                              <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                {group.subject}
                              </p>

                              <h3 className="mt-1 text-base font-semibold text-primary-text">
                                {group.name}
                              </h3>

                              <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-relaxed text-secondary">
                                {group.description ||
                                  "Collaborate and learn together with your peers."}
                              </p>

                              <div className="mt-4 flex items-center justify-between">
                                <span className="inline-flex items-center gap-1.5 text-[10px] text-secondary">
                                  <Users size={12} />
                                  {group.members?.length || 0} members
                                </span>

                                <button
                                  type="button"
                                  disabled={
                                    membershipLoading === group._id
                                  }
                                  onClick={() => {
                                    if (member) {
                                      openGroup(group);
                                    } else {
                                      toggleMembership(group);
                                    }
                                  }}
                                  className="
                                    inline-flex items-center gap-1.5
                                    rounded-lg bg-amber-500
                                    px-3.5 py-2
                                    text-xs font-semibold text-ink-950
                                    transition
                                    hover:bg-amber-400
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                  "
                                >
                                  {membershipLoading === group._id ? (
                                    <Loader2
                                      size={14}
                                      className="animate-spin"
                                    />
                                  ) : member ? (
                                    <>
                                      Open
                                      <ArrowUpRight size={13} />
                                    </>
                                  ) : (
                                    <>
                                      Join
                                      <UserPlus size={13} />
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* =================================================
                GROUP WORKSPACE
                ================================================= */}
            {selectedGroup && isMember(selectedGroup) && (
              <div>
                {/* Group header */}
                <section className="relative overflow-hidden rounded-2xl border border-border-default bg-surface shadow-sm">
                  <div
                    className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl"
                    aria-hidden="true"
                  />

                  <div className="relative px-5 py-5 sm:px-6 sm:py-6">
                    <button
                      type="button"
                      onClick={() => setSelectedGroup(null)}
                      className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-secondary transition hover:text-primary-text"
                    >
                      <ArrowLeft size={14} />
                      All study groups
                    </button>

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <span className="inline-flex rounded-full bg-amber-400/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                          {selectedGroup.subject}
                        </span>

                        <h1 className="mt-3 font-display text-2xl font-semibold text-primary-text sm:text-3xl">
                          {selectedGroup.name}
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-secondary">
                          {selectedGroup.description ||
                            "Collaborate and learn together with your peers."}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-secondary">
                          <span className="inline-flex items-center gap-1.5">
                            <Users size={13} />
                            {selectedGroup.members?.length || 0} members
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 size={13} />
                            Created by{" "}
                            {selectedGroup.createdBy?.name || "Unknown"}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={
                          membershipLoading === selectedGroup._id
                        }
                        onClick={() =>
                          toggleMembership(selectedGroup)
                        }
                        className="btn-ghost inline-flex shrink-0 items-center justify-center gap-2 !py-2 text-xs"
                      >
                        {membershipLoading === selectedGroup._id ? (
                          <Loader2
                            size={14}
                            className="animate-spin"
                          />
                        ) : (
                          <X size={14} />
                        )}
                        Leave Group
                      </button>
                    </div>
                  </div>
                </section>

                {/* Tabs */}
                <div className="sticky top-0 z-10 -mx-1 my-4 overflow-x-auto px-1 pb-1">
                  <div className="flex min-w-max gap-1.5 rounded-xl border border-border-default bg-surface p-1.5 shadow-sm">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      const active = activeTab === tab.id;

                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveTab(tab.id)}
                          className={`
                            inline-flex items-center gap-1.5
                            rounded-lg px-3.5 py-2
                            text-xs font-semibold
                            transition-all duration-150
                            ${
                              active
                                ? "bg-ink-900 text-white shadow-sm dark:bg-amber-500 dark:text-ink-950"
                                : "text-secondary hover:bg-surface-muted hover:text-primary-text"
                            }
                          `}
                        >
                          <Icon size={14} />
                          {tab.label}

                          {tab.id === "tasks" && tasks.length > 0 && (
                            <span
                              className={`
                                rounded-full px-1.5 py-0.5 text-[9px]
                                ${
                                  active
                                    ? "bg-white/15 dark:bg-ink-950/15"
                                    : "bg-surface-muted"
                                }
                              `}
                            >
                              {tasks.length}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {contentLoading && (
                  <div className="mb-4 flex items-center gap-2 rounded-xl border border-border-default bg-surface px-4 py-3 text-xs text-secondary">
                    <Loader2
                      size={14}
                      className="animate-spin text-primary"
                    />
                    Loading group workspace...
                  </div>
                )}

                {/* =================================================
                    OVERVIEW
                    ================================================= */}
                {activeTab === "overview" && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {[
                        {
                          label: "Members",
                          value: selectedGroup.members?.length || 0,
                          hint: "Active learners",
                          icon: Users,
                        },
                        {
                          label: "Resources",
                          value: resources.length,
                          hint: "Shared materials",
                          icon: FileText,
                        },
                        {
                          label: "Study tasks",
                          value: tasks.length,
                          hint: `${completedTasks} completed by you`,
                          icon: Target,
                        },
                      ].map((stat) => {
                        const Icon = stat.icon;

                        return (
                          <div
                            key={stat.label}
                            className="rounded-2xl border border-border-default bg-surface p-5 shadow-sm"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-muted text-secondary">
                                <Icon size={17} />
                              </div>
                            </div>

                            <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-secondary">
                              {stat.label}
                            </p>

                            <p className="mt-1 font-display text-2xl font-semibold text-primary-text">
                              {stat.value}
                            </p>

                            <p className="mt-0.5 text-[10px] text-secondary">
                              {stat.hint}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      {/* Recent resources */}
                      <section className="card">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <BookOpen size={15} />
                            </div>

                            <h2 className="text-sm font-semibold text-primary-text">
                              Shared resources
                            </h2>
                          </div>

                          <button
                            type="button"
                            onClick={() => setActiveTab("resources")}
                            className="text-[10px] font-semibold text-primary hover:underline"
                          >
                            View all
                          </button>
                        </div>

                        {resources.length === 0 ? (
                          <p className="rounded-xl bg-surface-muted/50 px-4 py-6 text-center text-xs text-secondary">
                            No resources have been shared yet.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {resources.slice(0, 3).map((resource) => (
                              <a
                                key={resource._id}
                                href={resource.url}
                                target="_blank"
                                rel="noreferrer"
                                className="group flex items-center gap-3 rounded-xl border border-border-default p-3 transition hover:border-amber-400/50 hover:bg-surface-muted/50"
                              >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-amber-600 dark:text-amber-400">
                                  <Link2 size={14} />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-xs font-semibold text-primary-text">
                                    {resource.title}
                                  </p>

                                  <p className="mt-0.5 truncate text-[10px] text-secondary">
                                    {resource.sharedBy?.name ||
                                      "Group member"}
                                  </p>
                                </div>

                                <ArrowUpRight
                                  size={14}
                                  className="shrink-0 text-secondary group-hover:text-primary"
                                />
                              </a>
                            ))}
                          </div>
                        )}
                      </section>

                      {/* Recent discussions */}
                      <section className="card">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <MessageCircle size={15} />
                            </div>

                            <h2 className="text-sm font-semibold text-primary-text">
                              Recent discussions
                            </h2>
                          </div>

                          <button
                            type="button"
                            onClick={() => setActiveTab("discussion")}
                            className="text-[10px] font-semibold text-primary hover:underline"
                          >
                            View all
                          </button>
                        </div>

                        {discussions.length === 0 ? (
                          <p className="rounded-xl bg-surface-muted/50 px-4 py-6 text-center text-xs text-secondary">
                            No discussions have started yet.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {discussions.slice(0, 3).map((discussion) => (
                              <button
                                type="button"
                                key={discussion._id}
                                onClick={() => setActiveTab("discussion")}
                                className="group flex w-full items-center gap-3 rounded-xl border border-border-default p-3 text-left transition hover:border-amber-400/50 hover:bg-surface-muted/50"
                              >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-xs font-bold text-amber-700 dark:text-amber-400">
                                  {discussion.postedBy?.name
                                    ?.charAt(0)
                                    ?.toUpperCase() || "U"}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-xs font-semibold text-primary-text">
                                    {discussion.postedBy?.name ||
                                      "Unknown"}
                                  </p>

                                  <p className="mt-0.5 truncate text-[10px] text-secondary">
                                    {discussion.content}
                                  </p>
                                </div>

                                <ChevronRight
                                  size={14}
                                  className="shrink-0 text-secondary group-hover:text-primary"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </section>
                    </div>
                  </div>
                )}

                {/* =================================================
                    RESOURCES
                    ================================================= */}
                {activeTab === "resources" && (
                  <div className="space-y-5">
                    <form
                      onSubmit={addResource}
                      className="card"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Plus size={17} />
                        </div>

                        <div>
                          <h2 className="font-display text-lg font-semibold text-primary-text">
                            Share a resource
                          </h2>

                          <p className="mt-0.5 text-xs text-secondary">
                            Add notes, videos, articles or useful websites.
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3">
                        <input
                          className="input-field"
                          placeholder="Resource title"
                          value={resourceForm.title}
                          onChange={(e) =>
                            setResourceForm({
                              ...resourceForm,
                              title: e.target.value,
                            })
                          }
                        />

                        <input
                          type="url"
                          className="input-field"
                          placeholder="https://example.com/resource"
                          value={resourceForm.url}
                          onChange={(e) =>
                            setResourceForm({
                              ...resourceForm,
                              url: e.target.value,
                            })
                          }
                        />

                        <textarea
                          className="input-field resize-none"
                          rows={2}
                          placeholder="Short description (optional)"
                          value={resourceForm.description}
                          onChange={(e) =>
                            setResourceForm({
                              ...resourceForm,
                              description: e.target.value,
                            })
                          }
                        />

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={resourceLoading}
                            className="btn-accent inline-flex items-center gap-2"
                          >
                            {resourceLoading ? (
                              <Loader2
                                size={15}
                                className="animate-spin"
                              />
                            ) : (
                              <Send size={15} />
                            )}
                            {resourceLoading
                              ? "Sharing..."
                              : "Share Resource"}
                          </button>
                        </div>
                      </div>
                    </form>

                    <section className="card">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h2 className="font-display text-lg font-semibold text-primary-text">
                            Shared resources
                          </h2>

                          <p className="mt-0.5 text-[11px] text-secondary">
                            Useful materials from your group
                          </p>
                        </div>

                        <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[10px] font-semibold text-secondary">
                          {resources.length}
                        </span>
                      </div>

                      {resources.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border-default bg-surface-muted/40 p-10 text-center">
                          <BookOpen
                            size={24}
                            className="mx-auto text-secondary"
                          />

                          <p className="mt-3 text-sm font-semibold text-primary-text">
                            No resources shared yet
                          </p>

                          <p className="mt-1 text-xs text-secondary">
                            Be the first member to share something useful.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          {resources.map((resource) => (
                            <article
                              key={resource._id}
                              className="group rounded-xl border border-border-default p-4 transition hover:border-amber-400/60 hover:shadow-sm"
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-amber-600 dark:text-amber-400">
                                  <Link2 size={16} />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex max-w-full items-center gap-1 text-sm font-semibold text-primary-text hover:text-amber-600 dark:hover:text-amber-400"
                                  >
                                    <span className="truncate">
                                      {resource.title}
                                    </span>
                                    <ArrowUpRight
                                      size={13}
                                      className="shrink-0"
                                    />
                                  </a>

                                  {resource.description && (
                                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-secondary">
                                      {resource.description}
                                    </p>
                                  )}

                                  <p className="mt-3 text-[10px] text-secondary">
                                    Shared by{" "}
                                    {resource.sharedBy?.name ||
                                      "Unknown"}
                                  </p>
                                </div>

                                {resource.sharedBy?._id === user?._id && (
                                  <button
                                    type="button"
                                    disabled={
                                      deletingResource === resource._id
                                    }
                                    onClick={() =>
                                      deleteResource(resource._id)
                                    }
                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-secondary transition hover:bg-red-500/10 hover:text-red-500 disabled:opacity-50"
                                    aria-label={`Delete ${resource.title}`}
                                  >
                                    {deletingResource === resource._id ? (
                                      <Loader2
                                        size={14}
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <Trash2 size={14} />
                                    )}
                                  </button>
                                )}
                              </div>
                            </article>
                          ))}
                        </div>
                      )}
                    </section>
                  </div>
                )}

                {/* =================================================
                    DISCUSSION
                    ================================================= */}
                {activeTab === "discussion" && (
                  <div className="space-y-5">
                    <form
                      onSubmit={addDiscussion}
                      className="card"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <MessageCircle size={17} />
                        </div>

                        <div>
                          <h2 className="font-display text-lg font-semibold text-primary-text">
                            Start a discussion
                          </h2>

                          <p className="mt-0.5 text-xs text-secondary">
                            Ask doubts, share ideas or help another learner.
                          </p>
                        </div>
                      </div>

                      <textarea
                        className="input-field mt-5 resize-none"
                        rows={4}
                        placeholder="Ask a question or start a discussion..."
                        value={discussionText}
                        onChange={(e) =>
                          setDiscussionText(e.target.value)
                        }
                      />

                      <div className="mt-3 flex justify-end">
                        <button
                          type="submit"
                          disabled={discussionLoading}
                          className="btn-accent inline-flex items-center gap-2"
                        >
                          {discussionLoading ? (
                            <Loader2
                              size={15}
                              className="animate-spin"
                            />
                          ) : (
                            <Send size={15} />
                          )}
                          {discussionLoading ? "Posting..." : "Post Discussion"}
                        </button>
                      </div>
                    </form>

                    <section className="card">
                      <div className="mb-5 flex items-center justify-between">
                        <div>
                          <h2 className="font-display text-lg font-semibold text-primary-text">
                            Recent discussions
                          </h2>

                          <p className="mt-0.5 text-[11px] text-secondary">
                            Conversations happening in your group
                          </p>
                        </div>

                        <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[10px] font-semibold text-secondary">
                          {discussions.length}
                        </span>
                      </div>

                      {discussions.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border-default bg-surface-muted/40 p-10 text-center">
                          <MessageCircle
                            size={24}
                            className="mx-auto text-secondary"
                          />

                          <p className="mt-3 text-sm font-semibold text-primary-text">
                            No discussions yet
                          </p>

                          <p className="mt-1 text-xs text-secondary">
                            Start the first conversation with your group.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {discussions.map((discussion) => (
                            <article
                              key={discussion._id}
                              className="rounded-xl border border-border-default p-4 transition hover:border-border-strong"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-xs font-bold text-amber-700 dark:text-amber-400">
                                  {discussion.postedBy?.name
                                    ?.charAt(0)
                                    ?.toUpperCase() || "U"}
                                </div>

                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-primary-text">
                                    {discussion.postedBy?.name ||
                                      "Unknown"}
                                  </p>

                                  <p className="mt-0.5 text-[10px] text-secondary">
                                    {discussion.createdAt
                                      ? new Date(
                                          discussion.createdAt
                                        ).toLocaleString()
                                      : ""}
                                  </p>
                                </div>
                              </div>

                              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-secondary">
                                {discussion.content}
                              </p>
                            </article>
                          ))}
                        </div>
                      )}
                    </section>
                  </div>
                )}

                {/* =================================================
                    TASKS
                    ================================================= */}
                {activeTab === "tasks" && (
                  <div className="space-y-5">
                    <form
                      onSubmit={addTask}
                      className="card"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Target size={17} />
                        </div>

                        <div>
                          <h2 className="font-display text-lg font-semibold text-primary-text">
                            Create a study task
                          </h2>

                          <p className="mt-0.5 text-xs text-secondary">
                            Give your group a shared learning goal.
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3">
                        <input
                          className="input-field"
                          placeholder="Task title"
                          value={taskForm.title}
                          onChange={(e) =>
                            setTaskForm({
                              ...taskForm,
                              title: e.target.value,
                            })
                          }
                        />

                        <textarea
                          className="input-field resize-none"
                          rows={2}
                          placeholder="Task description (optional)"
                          value={taskForm.description}
                          onChange={(e) =>
                            setTaskForm({
                              ...taskForm,
                              description: e.target.value,
                            })
                          }
                        />

                        <div>
                          <label
                            htmlFor="group-task-date"
                            className="label"
                          >
                            Due date
                          </label>

                          <div className="relative">
                            <CalendarDays
                              size={16}
                              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary"
                            />

                            <input
                              id="group-task-date"
                              type="date"
                              className="input-field pl-10"
                              value={taskForm.dueDate}
                              onChange={(e) =>
                                setTaskForm({
                                  ...taskForm,
                                  dueDate: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={taskLoading}
                            className="btn-accent inline-flex items-center gap-2"
                          >
                            {taskLoading ? (
                              <Loader2
                                size={15}
                                className="animate-spin"
                              />
                            ) : (
                              <Plus size={15} />
                            )}
                            {taskLoading ? "Adding..." : "Add Task"}
                          </button>
                        </div>
                      </div>
                    </form>

                    <section className="card">
                      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h2 className="font-display text-lg font-semibold text-primary-text">
                            Group study tasks
                          </h2>

                          <p className="mt-0.5 text-[11px] text-secondary">
                            Work through shared goals together.
                          </p>
                        </div>

                        {tasks.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[10px] font-semibold text-secondary">
                              {completedTasks}/{tasks.length} done
                            </span>
                          </div>
                        )}
                      </div>

                      {tasks.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border-default bg-surface-muted/40 p-10 text-center">
                          <Target
                            size={24}
                            className="mx-auto text-secondary"
                          />

                          <p className="mt-3 text-sm font-semibold text-primary-text">
                            No tasks created yet
                          </p>

                          <p className="mt-1 text-xs text-secondary">
                            Create a shared study goal for your group.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {tasks.map((task) => {
                            const completed = isTaskCompleted(task);
                            const updating = togglingTask === task._id;

                            return (
                              <article
                                key={task._id}
                                className={`
                                  rounded-xl border p-4
                                  transition-all duration-150
                                  ${
                                    completed
                                      ? "border-emerald-500/20 bg-emerald-500/5"
                                      : "border-border-default hover:border-amber-400/50"
                                  }
                                `}
                              >
                                <div className="flex items-start gap-3">
                                  <button
                                    type="button"
                                    disabled={updating}
                                    onClick={() =>
                                      toggleTask(task._id)
                                    }
                                    className={`
                                      mt-0.5 flex h-6 w-6 shrink-0
                                      items-center justify-center
                                      rounded-lg border-2
                                      transition
                                      ${
                                        completed
                                          ? "border-emerald-500 bg-emerald-500 text-white"
                                          : "border-border-strong bg-surface hover:border-amber-500"
                                      }
                                    `}
                                    aria-label={
                                      completed
                                        ? "Mark task incomplete"
                                        : "Mark task complete"
                                    }
                                  >
                                    {updating ? (
                                      <Loader2
                                        size={12}
                                        className="animate-spin"
                                      />
                                    ) : completed ? (
                                      <Check size={13} strokeWidth={3} />
                                    ) : null}
                                  </button>

                                  <div className="min-w-0 flex-1">
                                    <p
                                      className={`text-sm font-semibold ${
                                        completed
                                          ? "text-secondary line-through"
                                          : "text-primary-text"
                                      }`}
                                    >
                                      {task.title}
                                    </p>

                                    {task.description && (
                                      <p className="mt-1 text-xs leading-relaxed text-secondary">
                                        {task.description}
                                      </p>
                                    )}

                                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] text-secondary">
                                      {task.dueDate && (
                                        <span className="inline-flex items-center gap-1.5">
                                          <CalendarDays size={12} />
                                          Due:{" "}
                                          {new Date(
                                            task.dueDate
                                          ).toLocaleDateString()}
                                        </span>
                                      )}

                                      <span className="inline-flex items-center gap-1.5">
                                        <CheckCircle2 size={12} />
                                        {task.completedBy?.length || 0}{" "}
                                        completed
                                      </span>

                                      {task.createdBy?.name && (
                                        <span>
                                          Created by {task.createdBy.name}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </article>
                            );
                          })}
                        </div>
                      )}
                    </section>
                  </div>
                )}

                {/* =================================================
                    MEMBERS
                    ================================================= */}
                {activeTab === "members" && (
                  <section className="card">
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <h2 className="font-display text-lg font-semibold text-primary-text">
                          Group members
                        </h2>

                        <p className="mt-0.5 text-[11px] text-secondary">
                          Everyone learning in this community
                        </p>
                      </div>

                      <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[10px] font-semibold text-secondary">
                        {selectedGroup.members?.length || 0}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {selectedGroup.members?.map((member) => (
                        <div
                          key={member._id}
                          className="flex items-center justify-between gap-3 rounded-xl border border-border-default p-4 transition hover:border-border-strong"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-sm font-bold text-amber-700 dark:text-amber-400">
                              {member.name
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-primary-text">
                                {member.name}
                              </p>

                              <p className="mt-0.5 text-[10px] text-secondary">
                                Study Group Member
                              </p>
                            </div>
                          </div>

                          {member._id ===
                            selectedGroup.createdBy?._id && (
                            <span className="shrink-0 rounded-full bg-amber-400/15 px-2.5 py-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                              Creator
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default StudyGroups;