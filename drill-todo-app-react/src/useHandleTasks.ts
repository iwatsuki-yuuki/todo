import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

export type Task = {
  id: string;
  title: string;
  done: boolean;
  deadline?: string;
  category: string;
};

const tasksRef = collection(db, "tasks");

export const useHandleTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(tasksRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      setTasks(data);
    });
    return unsubscribe;
  }, []);

  const addTask = async (task: Omit<Task, "id">) => {
    await addDoc(tasksRef, task);
  };

  const removeTask = async (task: Task) => {
    await deleteDoc(doc(db, "tasks", task.id));
  };

  const setTaskDone = async (task: Task, done: boolean) => {
    await updateDoc(doc(db, "tasks", task.id), { done });
  };

  return {
    tasks,
    addTask,
    removeTask,
    setTaskDone,
  };
};
