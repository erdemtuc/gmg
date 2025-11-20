import { NextRequest, NextResponse } from "next/server";
import { getActivityEdit } from "@/features/activity/data/get-activity-edit-form";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const form = await getActivityEdit(id);
  return NextResponse.json(form);
}
