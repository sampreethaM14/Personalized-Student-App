import React, { useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  Code2,
  Database,
  LayoutTemplate,
  Lock,
  Server,
  Unlock,
  CheckCircle2,
  Cpu,
  ExternalLink,
  Check,
  Network
} from "lucide-react";
import Layout from "../components/Layout";

const INITIAL_COURSES = [
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    description: "Master problem-solving with arrays, trees, graphs, and dynamic programming.",
    icon: Code2,
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    solidBg: "bg-rose-500", 
    border: "group-hover:border-rose-500/50",
    glow: "group-hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]",
    topics: [
      { id: "t1", title: "Array", completed: false, url: "https://leetcode.com/problems/two-sum/" },
      { id: "t2", title: "String", completed: false, url: "https://leetcode.com/problems/reverse-string/" },
      { id: "t3", title: "Sorting", completed: false, url: "https://leetcode.com/problems/sort-an-array/" },
      { id: "t4", title: "Linked List", completed: false, url: "https://leetcode.com/problems/reverse-linked-list/" },
      { id: "t5", title: "Binary Search", completed: false, url: "https://leetcode.com/problems/binary-search/" },
      { id: "t6", title: "Stack", completed: false, url: "https://leetcode.com/problems/min-stack/" },
      { id: "t7", title: "Queue", completed: false, url: "https://leetcode.com/problems/implement-queue-using-stacks/" },
      { id: "t8", title: "Recursion", completed: false, url: "https://leetcode.com/problems/fibonacci-number/" },
      { id: "t9", title: "Backtracking", completed: false, url: "https://leetcode.com/problems/permutations/" },
      { id: "t10", title: "Tree", completed: false, url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
      { id: "t11", title: "Graph", completed: false, url: "https://leetcode.com/problems/number-of-islands/" },
      { id: "t12", title: "Dynamic Programming", completed: false, url: "https://leetcode.com/problems/coin-change/" },
      { id: "t13", title: "Tries", completed: false, url: "https://leetcode.com/problems/implement-trie-prefix-tree/" }
    ]
  },
  {
    id: "mern",
    title: "Full Stack Web Development",
    description: "Build production-ready web applications using MongoDB, Express, React, and Node.js.",
    icon: LayoutTemplate,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    solidBg: "bg-blue-500",
    border: "group-hover:border-blue-500/50",
    glow: "group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]",
    topics: [
      { id: "m1", title: "React Fundamentals", completed: false, url: "https://www.geeksforgeeks.org/reactjs-tutorials/" },
      { id: "m2", title: "State Management", completed: false, url: "https://www.geeksforgeeks.org/reactjs-state-management/" },
      { id: "m3", title: "Node.js Basics", completed: false, url: "https://www.geeksforgeeks.org/nodejs/" },
      { id: "m4", title: "Express Routing", completed: false, url: "https://www.geeksforgeeks.org/express-js/" },
      { id: "m5", title: "MongoDB Integration", completed: false, url: "https://www.geeksforgeeks.org/mongodb/" },
    ]
  },
  {
    id: "os",
    title: "Operating Systems",
    description: "Understand concurrency, memory management, scheduling, and file systems.",
    icon: Cpu,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    solidBg: "bg-emerald-500",
    border: "group-hover:border-emerald-500/50",
    glow: "group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]",
    topics: [
      { id: "o1", title: "Processes & Threads", completed: false, url: "https://www.geeksforgeeks.org/difference-between-process-and-thread/" },
      { id: "o2", title: "CPU Scheduling", completed: false, url: "https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/" },
      { id: "o3", title: "Deadlocks", completed: false, url: "https://www.geeksforgeeks.org/introduction-of-deadlock-in-operating-system/" },
      { id: "o4", title: "Memory Management", completed: false, url: "https://www.geeksforgeeks.org/memory-management-in-operating-system/" },
    ]
  },
  {
    id: "sysdesign",
    title: "Low-Level & High-Level Design",
    description: "Architect scalable systems and apply object-oriented design pillars effectively.",
    icon: Server,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    solidBg: "bg-amber-500",
    border: "group-hover:border-amber-500/50",
    glow: "group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]",
    topics: [
      { id: "s1", title: "OOP Pillars", completed: false, url: "https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/" },
      { id: "s2", title: "Design Patterns", completed: false, url: "https://www.geeksforgeeks.org/software-design-patterns/" },
      { id: "s3", title: "Database Sharding", completed: false, url: "https://www.geeksforgeeks.org/database-sharding-system-design-interview/" },
      { id: "s4", title: "Load Balancing", completed: false, url: "https://www.geeksforgeeks.org/load-balancing-system-design-interview/" },
    ]
  },
  {
    id: "dbms",
    title: "Database Management Systems",
    description: "Deep dive into relational models, normalization, SQL, and ACID properties.",
    icon: Database,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    solidBg: "bg-cyan-500",
    border: "group-hover:border-cyan-500/50",
    glow: "group-hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]",
    topics: [
      { id: "d1", title: "ER Model & Architecture", completed: false, url: "https://www.geeksforgeeks.org/introduction-of-er-model/" },
      { id: "d2", title: "Relational Model & Keys", completed: false, url: "https://www.geeksforgeeks.org/relational-model-in-dbms/" },
      { id: "d3", title: "Database Normalization", completed: false, url: "https://www.geeksforgeeks.org/introduction-of-database-normalization/" },
      { id: "d4", title: "SQL Queries & Joins", completed: false, url: "https://www.geeksforgeeks.org/sql-tutorial/" },
      { id: "d5", title: "Concurrency Control", completed: false, url: "https://www.geeksforgeeks.org/concurrency-control-in-dbms/" },
    ]
  },
  {
    id: "cn",
    title: "Computer Networks",
    description: "Understand the internet, OSI model, TCP/IP, and routing protocols.",
    icon: Network,
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
    solidBg: "bg-violet-500",
    border: "group-hover:border-violet-500/50",
    glow: "group-hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]",
    topics: [
      { id: "c1", title: "OSI & TCP/IP Models", completed: false, url: "https://www.geeksforgeeks.org/osi-model-computer-network/" },
      { id: "c2", title: "Data Link Layer", completed: false, url: "https://www.geeksforgeeks.org/data-link-layer/" },
      { id: "c3", title: "IP Addressing", completed: false, url: "https://www.geeksforgeeks.org/ip-addressing-introduction-and-classful-addressing/" },
      { id: "c4", title: "Routing Algorithms", completed: false, url: "https://www.geeksforgeeks.org/routing-algorithms-in-computer-networks/" },
      { id: "c5", title: "Application Layer", completed: false, url: "https://www.geeksforgeeks.org/application-layer-in-osi-model/" },
    ]
  }
];

const LearningHub = () => {
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  const markTopicComplete = (courseId, topicId, e) => {
    e.stopPropagation();
    setCourses(prevCourses => prevCourses.map(course => {
      if (course.id !== courseId) return course;
      return {
        ...course,
        topics: course.topics.map(topic => 
          topic.id === topicId ? { ...topic, completed: true } : topic
        )
      };
    }));
  };

  const handleTopicClick = (topic, status) => {
    if (status === 'locked') return;
    window.open(topic.url, '_blank');
  };

  const renderCourseLibrary = () => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => {
        const Icon = course.icon;
        const completed = course.topics.filter(t => t.completed).length;
        const total = course.topics.length;
        const progress = Math.round((completed / total) * 100);

        return (
          <button
            key={course.id}
            onClick={() => setSelectedCourseId(course.id)}
            className={`group flex flex-col items-start rounded-2xl border border-border-default bg-surface p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 ${course.border} ${course.glow} focus:outline-none`}
          >
            <div className="mb-4 flex w-full items-center justify-between">
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${course.bgColor} ${course.color} transition-transform duration-300 group-hover:scale-110`}>
                <Icon size={28} />
              </div>
              <span className={`text-sm font-bold ${course.color}`}>
                {progress}%
              </span>
            </div>
            
            <h3 className="mb-2 text-xl font-bold text-primary-text group-hover:text-primary transition-colors">
              {course.title}
            </h3>
            
            <p className="mb-8 flex-1 text-sm leading-relaxed text-secondary">
              {course.description}
            </p>
            
            <div className="w-full mt-auto">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold text-secondary">
                <span>Modules Completed</span>
                <span>{completed} of {total}</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-muted border border-border-default">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${course.solidBg}`} 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );

  const renderRoadmap = () => {
    const completedCount = selectedCourse.topics.filter(t => t.completed).length;
    const progress = Math.round((completedCount / selectedCourse.topics.length) * 100);
    let foundCurrent = false;

    return (
      <div className="relative flex min-h-[700px] flex-col overflow-hidden rounded-2xl border border-border-default bg-[#0f1115]">
        
        {/* Animated Checkered Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f1115]/50 to-[#0f1115]"></div>

        {/* Header Bar */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-[#161920]/80 px-4 py-4 backdrop-blur-md sm:px-6">
          <button 
            onClick={() => setSelectedCourseId(null)}
            className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-white/10 hover:text-white sm:gap-2 sm:px-4"
          >
            <ChevronLeft size={18} />
            <span className="hidden sm:inline">Library</span>
            <span className="sm:hidden">Back</span>
          </button>
          
          <div className="order-3 flex w-full flex-col items-center text-center sm:order-none sm:w-auto">
            <h2 className={`text-lg font-extrabold sm:text-xl ${selectedCourse.color}`}>{selectedCourse.title}</h2>
            <p className="text-xs text-gray-400">Quest Progress: {progress}%</p>
          </div>
          
          <div className="hidden items-center gap-1.5 md:flex">
            <span className="mr-2 text-xs font-bold text-gray-400">{completedCount}/{selectedCourse.topics.length}</span>
            {selectedCourse.topics.map((t, i) => (
              <div 
                key={i} 
                className={`h-2 w-4 rounded-full transition-colors duration-500 sm:w-6 lg:w-8 ${t.completed ? selectedCourse.solidBg : 'bg-gray-800'}`}
              />
            ))}
          </div>
        </div>

        {/* Central Timeline Roadmap */}
        <div className="relative z-10 flex flex-1 flex-col py-16 overflow-y-auto">
          
          {/* Central Line - Left aligned on mobile/tablet, centered on large desktop */}
          <div className="absolute bottom-0 top-12 left-6 w-1.5 -translate-x-1/2 rounded-full bg-gray-800/60 lg:left-1/2"></div>
          
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-12 px-4 relative">
            {selectedCourse.topics.map((topic, index) => {
              let status = "locked";
              if (topic.completed) {
                status = "completed";
              } else if (!foundCurrent) {
                status = "current";
                foundCurrent = true;
              }

              const isCompleted = status === "completed";
              const isCurrent = status === "current";
              const isLocked = status === "locked";
              const isEven = index % 2 === 0;

              return (
                <div key={topic.id} className={`relative flex w-full justify-end lg:justify-between ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  
                  {/* Empty space for large desktop alternating layout */}
                  <div className="hidden w-5/12 lg:block"></div>

                  {/* Central Node Indicator */}
                  <div className="absolute left-6 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center lg:left-1/2 lg:w-2/12">
                    <div className={`
                      h-5 w-5 sm:h-6 sm:w-6 rounded-full border-4 border-[#0f1115] transition-all duration-500
                      ${isCompleted ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]' : ''}
                      ${isCurrent ? 'bg-amber-500 ring-4 ring-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.8)]' : ''}
                      ${isLocked ? 'bg-gray-700' : ''}
                    `}></div>
                  </div>

                  {/* Topic Card Container */}
                  <div className={`flex w-[calc(100%-3rem)] sm:w-[calc(100%-4rem)] lg:w-5/12 ${isEven ? 'lg:justify-end' : 'lg:justify-start'}`}>
                    <div className="relative flex w-full max-w-sm items-center gap-4 sm:w-auto">
                      
                      {/* Interactive Card */}
                      <button 
                        disabled={isLocked}
                        onClick={() => handleTopicClick(topic, status)}
                        title={isLocked ? "Complete previous topics to unlock" : `Learn ${topic.title}`}
                        className={`
                          relative flex w-full sm:w-64 items-center gap-3 sm:gap-4 rounded-2xl border px-3 sm:px-4 py-3 transition-all duration-300
                          ${isCompleted ? 'border-emerald-500/40 bg-[#162a22] shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:bg-[#1a332a]' : ''}
                          ${isCurrent ? 'border-amber-500/60 bg-[#2b2110] shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:bg-[#382b15] hover:-translate-y-1' : ''}
                          ${isLocked ? 'cursor-not-allowed border-gray-800 bg-[#161920] opacity-50' : ''}
                        `}
                      >
                        {/* Status Icon */}
                        <div className={`
                          flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full transition-colors
                          ${isCompleted ? 'bg-emerald-500 text-white' : ''}
                          ${isCurrent ? 'bg-amber-500 text-white animate-pulse' : ''}
                          ${isLocked ? 'bg-gray-800 text-gray-500' : ''}
                        `}>
                          {isCompleted && <CheckCircle2 size={18} className="sm:w-5 sm:h-5" />}
                          {isCurrent && <Unlock size={16} className="ml-0.5 sm:w-[18px] sm:h-[18px]" />}
                          {isLocked && <Lock size={16} className="sm:w-[18px] sm:h-[18px]" />}
                        </div>
                        
                        <div className="flex flex-col items-start text-left overflow-hidden">
                          <span className={`font-bold text-xs sm:text-sm truncate w-full ${isLocked ? 'text-gray-500' : 'text-gray-100'}`}>
                            {topic.title}
                          </span>
                          {!isLocked && (
                            <span className="mt-0.5 flex items-center gap-1 text-[9px] sm:text-[10px] uppercase tracking-wider text-gray-400 group-hover:text-gray-200">
                              <ExternalLink size={10} /> Read Concept
                            </span>
                          )}
                        </div>
                      </button>

                      {/* Action Button: Mark Complete */}
                      {isCurrent && (
                        <button
                          onClick={(e) => markTopicComplete(selectedCourse.id, topic.id, e)}
                          className={`
                            absolute -right-2 -top-3 z-20 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-emerald-500/50 
                            bg-[#161920] text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] 
                            transition-all hover:scale-110 hover:bg-emerald-500 hover:text-white
                            lg:top-1/2 lg:-translate-y-1/2 lg:bg-emerald-500/10
                            ${isEven ? 'lg:-left-14 lg:right-auto' : 'lg:-right-14 lg:left-auto'}
                          `}
                          title="Mark as completed to unlock next"
                        >
                          <Check size={18} strokeWidth={3} className="sm:w-5 sm:h-5" />
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout
      title="Learning Hub"
      subtitle={selectedCourse ? "Follow the roadmap to master the concepts." : "Select a path to begin your learning journey."}
    >
      <div className="mx-auto w-full max-w-[1400px] space-y-6">
        {selectedCourse ? renderRoadmap() : renderCourseLibrary()}
      </div>
    </Layout>
  );
};

export default LearningHub;