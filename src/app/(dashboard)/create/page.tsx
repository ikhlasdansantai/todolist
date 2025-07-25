"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormEvent, useEffect, useState } from "react";

const BASE_URL = "http://94.74.86.174:8080/api/";
export default function CreateList() {
  const [todoItem, setTodoItem] = useState<string>("");
  const [todoItems, setTodoItems] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const getToken = localStorage.getItem("token");

  const handleSubmitTodo = async (e: FormEvent) => {
    setIsLoading(true);
    e.preventDefault();

    const res = await fetch(`${BASE_URL}checklist`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${getToken}`,
      },
      body: JSON.stringify({
        name: todoItem,
      }),
    });

    if (!res.ok) throw new Error("server internal error");

    getTodoLists();
    setIsLoading(false);
  };

  const getTodoLists = async () => {
    setIsLoading(true);
    const res = await fetch(`${BASE_URL}checklist`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${getToken}`,
      },
    });

    const data = await res.json();
    setTodoItems(data.data);
    console.log(data.data);
    console.log("get-rerender");

    setIsLoading(false);
  };

  const deleteTodoList = async (id: number) => {
    setIsLoading(true);
    const res = await fetch(`${BASE_URL}checklist/${+id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${getToken}`,
      },
    });

    if (!res.ok) throw new Error("Server internal error");
    const filteredList = todoItems.filter((item: any) => item.id !== id);
    setTodoItems(filteredList);
    setIsLoading(false);
  };

  useEffect(() => {
    getTodoLists();
  }, []);

  return (
    <section className="max-w-6xl mx-auto  py-20 space-y-10 p-4">
      <form onSubmit={(e) => handleSubmitTodo(e)} className="max-w-4xl mx-auto w-full text-center space-x-6 flex items-center justify-center">
        <input value={todoItem} placeholder="Create todo..." onChange={(e) => setTodoItem(e.target.value)} className="border p-3 pr-20 rounded-sm text-muted-foreground" />
        <Button size="lg" disabled={isLoading}>
          Create Todo
        </Button>
      </form>
      {isLoading && <SkeletonLoading />}
      <section className="grid grid-cols-3 gap-10">
        {!isLoading && todoItems ? (
          todoItems.map((item: any, index: number) => (
            <Card key={item.id}>
              <CardHeader className="min-h-10">
                <CardTitle className="text-2xl">{item.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={() => deleteTodoList(item.id)}>
                  Delete todo
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>Gak ada brow</p>
        )}
      </section>
    </section>
  );
}

function SkeletonLoading() {
  return (
    <div className="grid grid-cols-3 gap-10">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse py-18 bg-slate-400 rounded-sm" />
      ))}
    </div>
  );
}
