import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({ reply: "Моля, напишете съобщение." });
    }

    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Ти си AI бизнес консултант. Отговаряй ясно, професионално и полезно."
            },
            { role: "user", content: userMessage }
          ],
          temperature: 0.7
        })
      }
    );

    const data = await openaiResponse.json();

    // 🔒 Защита срещу undefined
    const reply =
      data?.choices?.[0]?.message?.content ||
      "В момента не мога да отговоря. Опитай отново.";

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.json({
      reply: "Възникна техническа грешка. Моля, опитай по-късно."
    });
  }
});

app.listen(3000, () => {
  console.log("AI backend работи на порт 3000");
});
