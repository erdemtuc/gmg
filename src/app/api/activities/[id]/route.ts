import { NextRequest, NextResponse } from "next/server";
import { getActivityDetail } from "@/features/activity/data/get-activity-detail";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const numId = Number(id);
  if (isNaN(numId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const activity = await getActivityDetail(numId);
    return NextResponse.json(activity);
  } catch (e) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
