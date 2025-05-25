import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building2, CalendarCheck, FileBarChart2 } from "lucide-react";

export default function AdminSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Employees</CardTitle>
          <Users className="text-primary-600 dark:text-primary-400" size={32} />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">124</div>
          <CardDescription>Total Employees</CardDescription>
          <Button className="mt-4 w-full" variant="outline" size="sm">
            View All
          </Button>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Departments</CardTitle>
          <Building2
            className="text-primary-600 dark:text-primary-400"
            size={32}
          />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">6</div>
          <CardDescription>Active Departments</CardDescription>
          <Button className="mt-4 w-full" variant="outline" size="sm">
            Manage
          </Button>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Attendance</CardTitle>
          <CalendarCheck
            className="text-primary-600 dark:text-primary-400"
            size={32}
          />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">98%</div>
          <CardDescription>Attendance Rate</CardDescription>
          <Button className="mt-4 w-full" variant="outline" size="sm">
            View Details
          </Button>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Reports</CardTitle>
          <FileBarChart2
            className="text-primary-600 dark:text-primary-400"
            size={32}
          />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">12</div>
          <CardDescription>Monthly Reports</CardDescription>
          <Button className="mt-4 w-full" variant="outline" size="sm">
            Generate
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
