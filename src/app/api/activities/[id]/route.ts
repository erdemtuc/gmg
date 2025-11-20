import { NextRequest, NextResponse } from "next/server";
import { getActivityDetail } from "@/features/activity/data/get-activity-detail";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const activity = await getActivityDetail(id);
    return NextResponse.json(activity);
  } catch (e) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
