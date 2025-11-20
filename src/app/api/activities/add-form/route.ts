import { NextRequest, NextResponse } from "next/server";
import { getActivityAdd } from "@/features/activity/data/get-activity-add-form";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status") ?? undefined;
  const taskType = searchParams.get("task_type") ?? undefined;

  const form = await getActivityAdd(status, taskType);
  return NextResponse.json(form);
}
