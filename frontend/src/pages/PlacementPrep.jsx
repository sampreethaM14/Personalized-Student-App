import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import {
  ArrowUpRight,
  Award,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Code2,
  Database,
  Globe,
  Layers3,
  Network,
  Search,
  Sparkles,
  Target,
  Users,
  X,
} from "lucide-react";

const PlacementPrep = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const defaultResources = [
    {
      _id: "array",
      category: "DSA",
      title: "Arrays",
      description:
        "Learn array traversal, searching, sorting, prefix sums and important interview problems.",
      url: "https://leetcode.com/tag/array/",
    },
    {
      _id: "linkedlist",
      category: "DSA",
      title: "Linked Lists",
      description:
        "Practice singly linked lists, doubly linked lists, reversal and cycle detection.",
      url: "https://leetcode.com/tag/linked-list/",
    },
    {
      _id: "string",
      category: "DSA",
      title: "Strings",
      description:
        "Learn string manipulation, palindrome, substring and pattern-based problems.",
      url: "https://leetcode.com/tag/string/",
    },
    {
      _id: "tree",
      category: "DSA",
      title: "Trees",
      description:
        "Practice binary trees, BST, traversals, recursion and important tree problems.",
      url: "https://leetcode.com/tag/tree/",
    },
    {
      _id: "graph",
      category: "DSA",
      title: "Graphs",
      description:
        "Learn BFS, DFS, shortest path, Dijkstra and graph traversal algorithms.",
      url: "https://leetcode.com/tag/graph/",
    },
    {
      _id: "dp",
      category: "DSA",
      title: "Dynamic Programming",
      description:
        "Practice memoization, tabulation, knapsack, LIS and other DP patterns.",
      url: "https://leetcode.com/tag/dynamic-programming/",
    },

    {
      _id: "quantitative",
      category: "Aptitude",
      title: "Quantitative Aptitude",
      description:
        "Practice percentages, profit and loss, time and work, ratios and averages.",
      url: "https://www.indiabix.com/aptitude/questions-and-answers/",
    },
    {
      _id: "logical",
      category: "Aptitude",
      title: "Logical Reasoning",
      description:
        "Improve logical thinking with puzzles, coding-decoding and reasoning problems.",
      url: "https://www.indiabix.com/logical-reasoning/questions-and-answers/",
    },
    {
      _id: "verbal",
      category: "Aptitude",
      title: "Verbal Ability",
      description:
        "Practice English grammar, vocabulary, reading comprehension and communication.",
      url: "https://www.indiabix.com/verbal-ability/questions-and-answers/",
    },

    {
      _id: "os-process",
      category: "Operating System",
      title: "Processes & Threads",
      description:
        "Understand processes, threads, scheduling and process synchronization.",
      url: "https://www.geeksforgeeks.org/operating-systems/",
    },
    {
      _id: "os-memory",
      category: "Operating System",
      title: "Memory Management",
      description:
        "Learn paging, segmentation, virtual memory and page replacement algorithms.",
      url: "https://www.geeksforgeeks.org/memory-management-in-operating-system/",
    },
    {
      _id: "os-deadlock",
      category: "Operating System",
      title: "Deadlocks",
      description:
        "Understand deadlock conditions, prevention, avoidance and Banker's algorithm.",
      url: "https://www.geeksforgeeks.org/deadlock-in-operating-system/",
    },

    {
      _id: "cn-basics",
      category: "Computer Networks",
      title: "Networking Fundamentals",
      description:
        "Learn OSI model, TCP/IP model, network devices and communication basics.",
      url: "https://www.geeksforgeeks.org/computer-network-tutorials/",
    },
    {
      _id: "cn-protocols",
      category: "Computer Networks",
      title: "Network Protocols",
      description:
        "Understand HTTP, HTTPS, TCP, UDP, DNS, FTP and other important protocols.",
      url: "https://www.geeksforgeeks.org/types-of-network-protocols/",
    },
    {
      _id: "cn-routing",
      category: "Computer Networks",
      title: "Routing & Switching",
      description:
        "Learn routing algorithms, IP addressing, subnetting and switching concepts.",
      url: "https://www.geeksforgeeks.org/computer-networks/",
    },

    {
      _id: "oops-basics",
      category: "OOPs",
      title: "OOPs Fundamentals",
      description:
        "Learn classes, objects, constructors, methods and object-oriented concepts.",
      url: "https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/",
    },
    {
      _id: "oops-pillars",
      category: "OOPs",
      title: "Four Pillars of OOPs",
      description:
        "Understand encapsulation, inheritance, polymorphism and abstraction.",
      url: "https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/",
    },
    {
      _id: "oops-interview",
      category: "OOPs",
      title: "OOPs Interview Questions",
      description:
        "Prepare common OOPs interview questions and practical examples.",
      url: "https://www.geeksforgeeks.org/oops-interview-questions/",
    },

    {
      _id: "dbms-basics",
      category: "DBMS",
      title: "DBMS Fundamentals",
      description:
        "Learn database concepts, ER models, relational models and normalization.",
      url: "https://www.geeksforgeeks.org/dbms/",
    },
    {
      _id: "sql",
      category: "DBMS",
      title: "SQL Practice",
      description:
        "Practice SELECT, JOIN, GROUP BY, subqueries and SQL interview questions.",
      url: "https://www.hackerrank.com/domains/sql",
    },
    {
      _id: "dbms-normalization",
      category: "DBMS",
      title: "Normalization",
      description:
        "Understand functional dependencies and normal forms from 1NF to BCNF.",
      url: "https://www.geeksforgeeks.org/introduction-of-database-normalization/",
    },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const [placement, interview] = await Promise.all([
          api.get("/resources?category=placement"),
          api.get("/resources?category=interview"),
        ]);

        setResources([
          ...defaultResources,
          ...placement.data,
          ...interview.data,
        ]);
      } catch (error) {
        console.error("Error loading resources:", error);
        setResources(defaultResources);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const checklist = [
    "Revise DSA concepts and solve coding problems",
    "Practice quantitative and logical aptitude",
    "Revise DBMS, OOPs, OS and Computer Networks",
    "Build and update your resume and GitHub profile",
    "Practice mock technical and HR interviews",
    "Research target companies and job roles",
    "Review your Skill Gap results and improve weak areas",
  ];

  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(new Set(resources.map((resource) => resource.category))),
    ];
  }, [resources]);

  const filteredResources = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return resources.filter((resource) => {
      const matchesCategory =
        activeCategory === "All" ||
        resource.category === activeCategory;

      const matchesSearch =
        !searchTerm ||
        `${resource.title} ${resource.description || ""} ${
          resource.category
        }`
          .toLowerCase()
          .includes(searchTerm);

      return matchesCategory && matchesSearch;
    });
  }, [resources, activeCategory, search]);

  const categoryIcon = (category) => {
    switch (category) {
      case "DSA":
        return Code2;
      case "Aptitude":
        return Target;
      case "Operating System":
        return Layers3;
      case "Computer Networks":
        return Network;
      case "OOPs":
        return Users;
      case "DBMS":
        return Database;
      case "placement":
        return BriefcaseBusiness;
      case "interview":
        return Users;
      default:
        return BookOpen;
    }
  };

  const categoryStyle = (category) => {
    switch (category) {
      case "DSA":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-300";
      case "Aptitude":
        return "bg-violet-500/10 text-violet-700 dark:text-violet-300";
      case "Operating System":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
      case "Computer Networks":
        return "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300";
      case "OOPs":
        return "bg-pink-500/10 text-pink-700 dark:text-pink-300";
      case "DBMS":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-300";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  return (
    <Layout
      title="Placement Prep"
      subtitle="Build the confidence and skills you need for your next opportunity."
    >
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* =====================================================
            Hero
            ===================================================== */}
        <section className="relative overflow-hidden rounded-2xl border border-border-default bg-surface shadow-sm">
          <div
            className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative px-5 py-6 sm:px-7 sm:py-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-600 dark:text-amber-400">
                  <BriefcaseBusiness size={25} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-xl font-semibold text-primary-text sm:text-2xl">
                      Get placement ready
                    </h2>

                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
                      <Sparkles size={11} />
                      Career Focus
                    </span>
                  </div>

                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-secondary">
                    Strengthen your coding, aptitude, core CS and interview
                    skills with a focused preparation path.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="rounded-xl bg-surface-muted px-3 py-3 text-center">
                  <p className="text-lg font-bold text-primary-text">
                    {resources.length}
                  </p>
                  <p className="text-[10px] text-secondary">Resources</p>
                </div>

                <div className="rounded-xl bg-surface-muted px-3 py-3 text-center">
                  <p className="text-lg font-bold text-primary-text">
                    {categories.length - 1}
                  </p>
                  <p className="text-[10px] text-secondary">Areas</p>
                </div>

                <div className="rounded-xl bg-surface-muted px-3 py-3 text-center">
                  <p className="text-lg font-bold text-primary-text">
                    7
                  </p>
                  <p className="text-[10px] text-secondary">Steps</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            Main layout
            ===================================================== */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* ===================================================
              Readiness checklist
              =================================================== */}
          <section className="card h-fit lg:col-span-1">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400/15 text-amber-600 dark:text-amber-400">
                <Award size={18} />
              </div>

              <div>
                <h2 className="font-display text-lg font-semibold text-primary-text">
                  Readiness checklist
                </h2>

                <p className="text-xs text-secondary">
                  Your preparation roadmap
                </p>
              </div>
            </div>

            <ul className="space-y-2.5">
              {checklist.map((item, index) => (
                <li
                  key={item}
                  className="
                    group flex items-start gap-3 rounded-xl
                    border border-border-default
                    bg-surface-muted/40 p-3
                    transition-all duration-150
                    hover:border-amber-400/50
                    hover:bg-amber-400/5
                  "
                >
                  <span
                    className="
                      flex h-6 w-6 shrink-0 items-center justify-center
                      rounded-full bg-emerald-500/10
                      text-emerald-600 dark:text-emerald-400
                    "
                    aria-hidden="true"
                  >
                    <CheckCircle2 size={14} />
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs font-medium leading-relaxed text-primary-text">
                      {item}
                    </p>

                    <p className="mt-0.5 text-[10px] text-secondary">
                      Step {index + 1}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-xl bg-primary/5 p-4">
              <div className="flex items-start gap-2.5">
                <Sparkles
                  size={16}
                  className="mt-0.5 shrink-0 text-primary"
                />

                <p className="text-xs leading-relaxed text-secondary">
                  <span className="font-semibold text-primary-text">
                    Tip:
                  </span>{" "}
                  Don't try to master everything at once. Pick one weak area,
                  practise consistently, then move to the next.
                </p>
              </div>
            </div>
          </section>

          {/* ===================================================
              Resources
              =================================================== */}
          <section className="min-w-0 lg:col-span-2">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold text-primary-text">
                  Preparation resources
                </h2>

                <p className="mt-1 text-xs text-secondary">
                  Choose an area and start building your interview skills.
                </p>
              </div>

              <span className="text-xs text-secondary">
                {filteredResources.length}{" "}
                {filteredResources.length === 1
                  ? "resource"
                  : "resources"}{" "}
                shown
              </span>
            </div>

            {/* Search */}
            <div className="mb-4">
              <label htmlFor="placement-search" className="sr-only">
                Search placement resources
              </label>

              <div className="relative">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary"
                  aria-hidden="true"
                />

                <input
                  id="placement-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search DSA, DBMS, aptitude, interviews..."
                  className="input-field pl-10"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-secondary hover:bg-surface-muted hover:text-primary-text"
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* Category filters */}
            <div className="mb-5 overflow-x-auto pb-1">
              <div className="flex min-w-max gap-2">
                {categories.map((category) => {
                  const Icon = categoryIcon(category);
                  const isActive = activeCategory === category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`
                        inline-flex items-center gap-1.5
                        rounded-full border px-3.5 py-2
                        text-xs font-semibold
                        transition-all duration-150
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-amber-500
                        ${
                          isActive
                            ? "border-ink-900 bg-ink-900 text-white dark:border-amber-500 dark:bg-amber-500 dark:text-ink-950"
                            : "border-border-default bg-surface text-secondary hover:border-amber-400 hover:text-primary-text"
                        }
                      `}
                    >
                      <Icon size={13} aria-hidden="true" />
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-52 animate-pulse rounded-2xl border border-border-default bg-surface-muted"
                  />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && filteredResources.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-default bg-surface-muted/50 px-5 py-14 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Search size={21} />
                </div>

                <h3 className="text-sm font-semibold text-primary-text">
                  No resources found
                </h3>

                <p className="mt-1 max-w-sm text-xs leading-relaxed text-secondary">
                  Try another keyword or choose a different preparation area.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("All");
                  }}
                  className="mt-4 text-xs font-semibold text-primary hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* Resource cards */}
            {!loading && filteredResources.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {filteredResources.map((resource) => {
                  const Icon = categoryIcon(resource.category);

                  return (
                    <a
                      key={resource._id}
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        group relative flex min-h-[205px]
                        flex-col overflow-hidden
                        rounded-2xl border border-border-default
                        bg-surface p-5 shadow-sm
                        transition-all duration-200
                        hover:-translate-y-1
                        hover:border-amber-400/60
                        hover:shadow-md
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-amber-500
                        focus-visible:ring-offset-2
                      "
                    >
                      {/* Decorative accent */}
                      <div
                        className="
                          absolute right-0 top-0 h-20 w-20
                          rounded-bl-full bg-primary/5
                          transition-colors
                          group-hover:bg-amber-400/10
                        "
                        aria-hidden="true"
                      />

                      <div className="relative flex items-start justify-between gap-3">
                        <div
                          className={`
                            flex h-10 w-10 items-center
                            justify-center rounded-xl
                            ${categoryStyle(resource.category)}
                          `}
                        >
                          <Icon size={19} aria-hidden="true" />
                        </div>

                        <span
                          className="
                            flex h-8 w-8 items-center justify-center
                            rounded-lg bg-surface-muted
                            text-secondary
                            transition-all duration-150
                            group-hover:bg-amber-400/15
                            group-hover:text-amber-600
                            dark:group-hover:text-amber-400
                          "
                        >
                          <ArrowUpRight size={16} aria-hidden="true" />
                        </span>
                      </div>

                      <div className="relative mt-4 flex-1">
                        <span
                          className={`
                            inline-flex rounded-full px-2 py-1
                            text-[10px] font-bold capitalize
                            ${categoryStyle(resource.category)}
                          `}
                        >
                          {resource.category}
                        </span>

                        <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-snug text-primary-text">
                          {resource.title}
                        </h3>

                        {resource.description && (
                          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-secondary">
                            {resource.description}
                          </p>
                        )}
                      </div>

                      <div className="relative mt-4 flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                        Start learning
                        <ChevronRight
                          size={14}
                          className="transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* =====================================================
            Bottom CTA
            ===================================================== */}
        <section className="overflow-hidden rounded-2xl border border-border-default bg-surface shadow-sm">
          <div className="flex flex-col items-start gap-4 px-5 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Globe size={18} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-primary-text">
                  Make preparation consistent
                </h3>

                <p className="mt-1 max-w-2xl text-xs leading-relaxed text-secondary">
                  Combine these resources with your Study Planner and Skill Gap
                  results to create a preparation routine that works for you.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 text-xs font-semibold text-secondary">
              <Sparkles size={14} className="text-amber-500" />
              Learn • Practise • Improve
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default PlacementPrep;