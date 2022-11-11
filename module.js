// Nuxt exposes its default route builder logic here
import { createRoutes, relativeTo } from "@nuxt/utils";
import path from "path";
import serveStatic from "serve-static";

// with a lot of pages it might be worth considering a folder pass
// to dynamically create this list
const pages = [
  "pages/hrPages/attendance/_TimeAttendanceEmployee.vue",
  "pages/hrPages/contract/_EmployeeContract.vue",
  "pages/hrPages/payslip/_Payslip.vue",
  "pages/hrPages/_hrHome.vue",
  // "pages/hrPages/EmployeePrivateHr.vue",
  "pages/Hrdashboard.vue",
  "pages/hrPages/timeAttendanceHistory/_TimeAttendanceHistoryAllEmployees.vue",
  "pages/hrPages/historyForAllRequests/_EmployeesRequests.vue",
  "pages/hrPages/businessHistory/_LeaveHistory.vue",
  "pages/hrPages/missingPunchHistory/_MissingPunchHistory.vue",
  "pages/hrPages/createNewEmployee/CreateNewEmployee.vue",
  "pages/settings/settings.vue",
  "pages/employee/addNewEmployee",
];
export default function NuxtModule() {
  const { routeNameSplitter, trailingSlash } = this.options.router;
  this.extendRoutes((routes) => {
    routes.push(
      ...createRoutes({
        files: pages,
        srcDir: __dirname,
        pagesDir: "pages",
        routeNameSplitter,
        trailingSlash,
      })
    );
  });
  this.addServerMiddleware(serveStatic(path.resolve(__dirname, "static")));

  this.nuxt.hook("components:dirs", (dirs) => {
    dirs.unshift({
      path: path.resolve(__dirname, "components"),
      level: 1, // provide a priority
    });
  });
}
