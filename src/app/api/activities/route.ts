import { NextRequest, NextResponse } from "next/server";
import { getActivities } from "@/features/activity/data/get-activities";
import { getAuthUser } from "@/features/shared/services/auth-user";

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    await getAuthUser();
  } catch (error) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page") ?? 1);

  try {
    const activities = await getActivities(page);
    return NextResponse.json(activities);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}
