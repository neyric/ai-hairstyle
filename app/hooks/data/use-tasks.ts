import { useEffect, useMemo, useState } from "react";

type UseTasksOptions<T> = {
  onUpdateTask: (task: T) => Promise<T>;
  taskKey: keyof T;
  verifySuccess: (task: T) => boolean;
  intervalMs?: number;
  immediate?: boolean;
};

export function useTasks<T>({
  onUpdateTask,
  taskKey,
  verifySuccess,
  intervalMs = 2000,
  immediate = false,
}: UseTasksOptions<T>) {
  const [tasks, setTasks] = useState<T[]>([]);

  const taskKeyString = useMemo(() => {
    return tasks
      .map((t) => String(t[taskKey]))
      .sort()
      .join("|");
  }, [tasks, taskKey]);

  const allCompleted = useMemo(() => {
    return tasks.every(verifySuccess);
  }, [tasks]);

  useEffect(() => {
    if (tasks.length === 0) return;

    const updateAllTasks = async () => {
      const updatedTasks = await Promise.all(
        tasks.map(async (task, idx) => {
          if (verifySuccess(task)) return task;

          try {
            const updated = await onUpdateTask(task);
            setTasks((prev) => {
              const copy = [...prev];
              copy[idx] = updated;
              return copy;
            });
            return updated;
          } catch {
            return task;
          }
        })
      );

      if (updatedTasks.every(verifySuccess)) {
        clearInterval(interval);
      }
    };

    if (immediate) {
      updateAllTasks();
    }

    const interval = setInterval(() => {
      updateAllTasks();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [taskKeyString]);

  return [tasks, setTasks, { allDone: allCompleted }] as const;
}
