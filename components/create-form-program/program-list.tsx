"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PlusCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  Search,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  useDeleteFormProgram,
  useFormPrograms,
} from "@/hooks/queries/useFormPrograms";

export default function ProgramList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const baseUrl = `/app/admin/forms`;

  const { data: programs, isPending, isError } = useFormPrograms();
  const deleteForm = useDeleteFormProgram();

  if (isPending) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error loading forms</div>;
  }

  const filteredPrograms = programs?.filter((program) =>
    program.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Back">
            <Link href={baseUrl} className="p-3">
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Form Programs</h1>
        </div>
        <Button onClick={() => router.push(`${baseUrl}/programs/create`)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Program
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search programs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      {filteredPrograms.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">
            No forms found. Create your first form!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrograms.map((program) => (
            <Card
              key={program.id}
              className="border-4"
              style={{
                borderColor: program.color,
              }}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{program.name}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`${baseUrl}/programs/edit/${program.id}`)
                        }
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => deleteForm.mutate(program.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                {program.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {program.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
