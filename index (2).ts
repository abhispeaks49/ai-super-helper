import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface RequestBody {
  type: 'chat' | 'resume' | 'caption' | 'homework' | 'business' | 'farming';
  message?: string;
  data?: any;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { type, message, data }: RequestBody = await req.json();

    let response = '';

    switch (type) {
      case 'chat':
        response = await handleChat(message || '');
        break;
      case 'resume':
        response = await handleResume(data);
        break;
      case 'caption':
        const captions = await handleCaption(data);
        return Response.json(
          { captions },
          {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      case 'homework':
        response = await handleHomework(data);
        break;
      case 'business':
        const names = await handleBusiness(data);
        return Response.json(
          { names },
          {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      case 'farming':
        response = await handleFarming(data);
        break;
      default:
        response = 'Invalid request type';
    }

    return Response.json(
      { response },
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return Response.json(
      { error: 'Internal server error', details: error.message },
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});

async function handleChat(message: string): Promise<string> {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

  if (!openaiApiKey) {
    return "Hello! I'm your AI assistant. I can help you with various tasks. What would you like to know?";
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant. Provide clear, concise, and helpful responses.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        max_tokens: 500,
      }),
    });

    const result = await response.json();
    return result.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
  } catch (error) {
    return "I'm here to help! How can I assist you today?";
  }
}

async function handleResume(data: any): Promise<string> {
  const { name, email, phone, skills, education, experience } = data;

  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

  if (!openaiApiKey) {
    return `RESUME

${name}
${email}${phone ? ' | ' + phone : ''}

SKILLS
${skills}

${education ? `EDUCATION\n${education}\n` : ''}
${experience ? `EXPERIENCE\n${experience}` : ''}`;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume writer. Create a well-formatted, professional resume based on the provided information.',
          },
          {
            role: 'user',
            content: `Create a professional resume for:\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nSkills: ${skills}\nEducation: ${education || 'N/A'}\nExperience: ${experience || 'N/A'}`,
          },
        ],
        max_tokens: 800,
      }),
    });

    const result = await response.json();
    return result.choices?.[0]?.message?.content || 'Error generating resume';
  } catch (error) {
    return `RESUME\n\n${name}\n${email}${phone ? ' | ' + phone : ''}\n\nSKILLS\n${skills}\n\n${education ? `EDUCATION\n${education}\n` : ''}${experience ? `EXPERIENCE\n${experience}` : ''}`;
  }
}

async function handleCaption(data: any): Promise<string[]> {
  const { topic, captionType } = data;

  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

  if (!openaiApiKey) {
    const defaultCaptions = {
      funny: [
        `Just ${topic} things 😂`,
        `Living my best ${topic} life!`,
        `${topic} mode: activated`,
        `Warning: ${topic} overload ahead!`,
        `Professional ${topic} enthusiast`,
      ],
      attitude: [
        `${topic} with confidence 😎`,
        `My ${topic}, my rules`,
        `Born to ${topic}`,
        `${topic} like a boss`,
        `Unapologetically into ${topic}`,
      ],
      love: [
        `In love with ${topic} ❤️`,
        `${topic} has my heart`,
        `Forever grateful for ${topic}`,
        `${topic} makes everything better`,
        `My love language: ${topic}`,
      ],
      motivational: [
        `${topic} is just the beginning 💪`,
        `Dream. ${topic}. Achieve.`,
        `Every ${topic} is progress`,
        `${topic}: Your journey starts here`,
        `Believe in your ${topic}`,
      ],
    };

    return defaultCaptions[captionType] || defaultCaptions.funny;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a creative Instagram caption writer. Generate 5 ${captionType} captions. Return only the captions, one per line.`,
          },
          {
            role: 'user',
            content: `Generate 5 ${captionType} Instagram captions about: ${topic}`,
          },
        ],
        max_tokens: 300,
      }),
    });

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || '';
    return content.split('\n').filter((line: string) => line.trim()).slice(0, 5);
  } catch (error) {
    return [`${topic} vibes ✨`, `Living the ${topic} life`, `${topic} moments`];
  }
}

async function handleHomework(data: any): Promise<string> {
  const { question, subject } = data;

  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

  if (!openaiApiKey) {
    return `Here's help with your ${subject || ''} question:\n\n${question}\n\nTo solve this, break it down into steps:\n1. Understand what's being asked\n2. Identify the key concepts\n3. Apply the relevant formulas or methods\n4. Check your answer\n\nFor detailed help, please consult your textbook or teacher.`;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful tutor. Explain concepts clearly and provide step-by-step guidance without giving direct answers. Encourage learning.',
          },
          {
            role: 'user',
            content: `${subject ? `Subject: ${subject}\n` : ''}Question: ${question}`,
          },
        ],
        max_tokens: 600,
      }),
    });

    const result = await response.json();
    return result.choices?.[0]?.message?.content || 'Error getting help';
  } catch (error) {
    return `Here's help with your question. Break it down into smaller parts and work through each step carefully.`;
  }
}

async function handleBusiness(data: any): Promise<string[]> {
  const { businessType, keywords } = data;

  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

  if (!openaiApiKey) {
    const suffixes = ['Hub', 'Pro', 'Zone', 'Labs', 'Express', 'Elite', 'Prime', 'Plus'];
    const prefixes = ['Smart', 'Quick', 'Best', 'Top', 'Premier', 'Global', 'Digital'];

    const names = [];
    for (let i = 0; i < 5; i++) {
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      names.push(`${prefix} ${businessType} ${suffix}`);
    }
    return names;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a creative business naming expert. Generate unique, catchy, and memorable business names. Return only the names, one per line.',
          },
          {
            role: 'user',
            content: `Generate 6 creative business names for a ${businessType}${keywords ? ` with these keywords: ${keywords}` : ''}`,
          },
        ],
        max_tokens: 200,
      }),
    });

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || '';
    return content.split('\n').filter((line: string) => line.trim()).slice(0, 6);
  } catch (error) {
    return [`${businessType} Pro`, `Best ${businessType}`, `${businessType} Plus`];
  }
}

async function handleFarming(data: any): Promise<string> {
  const { crop, location } = data;

  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

  if (!openaiApiKey) {
    return `Farming Tips for ${crop}:\n\n1. Soil Preparation: Ensure proper soil pH and nutrients\n2. Planting: Choose the right season and spacing\n3. Watering: Maintain consistent moisture levels\n4. Fertilization: Apply appropriate fertilizers\n5. Pest Control: Monitor and manage pests regularly\n6. Harvesting: Harvest at the right maturity stage\n\n${location ? `Note: These tips are general. Adapt them to your ${location} climate.` : 'Consult local agricultural experts for region-specific advice.'}`;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an agricultural expert. Provide practical farming tips and advice.',
          },
          {
            role: 'user',
            content: `Provide farming tips for growing ${crop}${location ? ` in ${location}` : ''}. Include soil preparation, planting, watering, and care instructions.`,
          },
        ],
        max_tokens: 600,
      }),
    });

    const result = await response.json();
    return result.choices?.[0]?.message?.content || 'Error getting farming tips';
  } catch (error) {
    return `Farming Tips for ${crop}:\n\n1. Prepare soil with proper nutrients\n2. Plant at the right season\n3. Water regularly\n4. Monitor for pests\n5. Harvest at maturity`;
  }
}
