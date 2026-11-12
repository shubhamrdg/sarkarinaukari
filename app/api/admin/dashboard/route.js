import { NextResponse } from "next/server";
import { getDashboardData } from "../../../../lib/admin";

export async function GET() {
  return NextResponse.json(await getDashboardData());
}
