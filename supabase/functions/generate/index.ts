// @ts-nocheck — Deno runtime, VS Code TS checker doesn't apply here
import OpenAI from "https://esm.sh/openai@4.52.7";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  try {
    const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { type, prompt } = await req.json();
    let result;

    if (type === "image") {
      const res = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
      });

      const tempUrl = res.data[0].url!;

      // Fetch image bytes and upload to Supabase Storage
      const imageRes = await fetch(tempUrl);
      const imageBytes = new Uint8Array(await imageRes.arrayBuffer());

      const filename = `${crypto.randomUUID()}.png`;
      const { error: uploadError } = await supabase.storage
        .from("generated-assets")
        .upload(filename, imageBytes, { contentType: "image/png" });

      if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`);

      const { data: { publicUrl } } = supabase.storage
        .from("generated-assets")
        .getPublicUrl(filename);

      result = { content_url: publicUrl, emoji: "🖼️" };
    } else {
      const systemPrompt =
        type === "doc"
          ? "You are a professional document writer. Create a detailed, well-structured, and valuable document based on the user's request. Use clear headings and sections."
          : "You are a professional content creator. Create structured, polished, and valuable PDF content based on the user's request. Use clear headings and formatting.";

      const res = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
      });
      result = {
        content_text: res.choices[0].message.content,
        emoji: type === "doc" ? "📄" : "📋",
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
