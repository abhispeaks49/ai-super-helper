export async function POST(request: Request) {
  try {
    const body = await request.json();

    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return Response.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const apiUrl = `${supabaseUrl}/functions/v1/ai-helper`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return Response.json(data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
