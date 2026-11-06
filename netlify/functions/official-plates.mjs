// Netlify Function: retrieves only the official Highway Bureau open-data CSV.
export default async () => {
  const url = "https://www.thb.gov.tw/Common/ThbOpenDataService.ashx?SN=506&format=1";
  try {
    const upstream = await fetch(url, { headers: { "Accept": "text/csv,*/*" } });
    if (!upstream.ok) {
      return new Response(JSON.stringify({ error: "Official source returned " + upstream.status }), {
        status: 502, headers: { "content-type": "application/json; charset=utf-8" }
      });
    }
    const body = await upstream.arrayBuffer();
    return new Response(body, {
      status: 200,
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "cache-control": "public, max-age=60",
        "access-control-allow-origin": "*",
        "x-data-source": "交通部公路局官方標牌公告"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unable to reach official source" }), {
      status: 502, headers: { "content-type": "application/json; charset=utf-8" }
    });
  }
};