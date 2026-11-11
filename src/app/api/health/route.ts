export const dynamic = "force-static";

export async function GET() {
  return Response.json(
    { ok: true },
    {
      headers: {
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
  );
}
