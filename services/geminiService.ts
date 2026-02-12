import { GoogleGenAI, Type } from "@google/genai";
import { MBTIState, Situation, QuestResult, UserHistory } from "../types";

export const generateQuest = async (
  mbti: MBTIState,
  situation: Situation,
  moodLabel: string,
  history: UserHistory[]
): Promise<QuestResult> => {
  // @google/genai 가이드라인 준수: process.env.API_KEY 직접 사용
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const mbtiString = `${mbti.E ? 'E' : 'I'}${mbti.S ? 'S' : 'N'}${mbti.T ? 'T' : 'F'}${mbti.J ? 'J' : 'P'}`;
  const now = new Date();
  const hour = now.getHours();

  let timeTheme = "";
  if (hour >= 5 && hour < 11) timeTheme = "활력과 확언";
  else if (hour >= 11 && hour < 18) timeTheme = "감각 환기와 집중력";
  else if (hour >= 18 && hour < 22) timeTheme = "이완과 하루 성찰";
  else timeTheme = "정적 휴식과 마인드풀니스";

  const systemInstruction = `당신은 'Mind-Sync Quest'의 핵심 엔진인 긍정 심리학 및 행동 경제학 전문가입니다.
사용자의 MBTI, 상황, 감정, 시간을 분석하여 1분 이내에 실행 가능한 '마이크로 퀘스트'를 JSON 형태로 설계합니다.

[수익화 전략 반영]
- 당신이 생성하는 퀘스트 결과 하단에는 구글 애드센스 광고(ca-pub-2406565946467658)가 배치될 예정입니다.
- 사용자가 광고를 보기 전, 퀘스트에 충분히 몰입할 수 있도록 매력적인 제목(title)과 과학적 근거(rationale)를 제공하십시오.
- 응답은 반드시 지정된 JSON 스키마를 준수해야 하며, 한국어로 작성합니다.`;

  const userPrompt = `[초정밀 심리 분석 및 퀘스트 설계 요청]

1. 사용자 프로필:
- MBTI: ${mbtiString}
- 현재 장소: ${situation}
- 감정 상태: ${moodLabel}
- 시간대 테마: ${timeTheme} (현재 시간: ${now.toLocaleTimeString()})

2. 제약 사항:
- ${situation}에서 별도 도구 없이 60초 안에 즉시 실행 가능할 것.
- ${mbtiString}의 특성에 맞춰 사고형(T)에게는 논리적 이득을, 감정형(F)에게는 정서적 지지를 강조할 것.`;

  try {
    // 초정밀 분석을 위해 gemini-3-pro-preview 모델 사용
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "퀘스트의 제목" },
            instruction: { type: Type.STRING, description: "구체적 행동 지침 (60초 이내)" },
            encouragement: { type: Type.STRING, description: "따뜻하고 힘이 되는 격려 메시지" },
            tag: { type: Type.STRING, description: "퀘스트의 성격 (1-2단어)" },
            questType: { type: Type.STRING, description: "movement/breathing/sensory/cognitive" },
            rationale: { type: Type.STRING, description: "심리학적/생리학적 과학적 근거" },
          },
          required: ["title", "instruction", "encouragement", "tag", "questType", "rationale"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("AI_RESPONSE_EMPTY");

    const parsedResult = JSON.parse(resultText);

    return { 
      ...parsedResult, 
      id: 'ai_' + Date.now(),
      isAiGenerated: true 
    } as QuestResult;
  } catch (error) {
    console.error("Gemini AI Engine Critical Error:", error);
    // 폴백 로직: AI 장애 시 사용자 경험 보호를 위한 기본 퀘스트
    return {
      id: 'fallback_' + Date.now(),
      title: "마음의 중심 잡기",
      instruction: "허리를 곧게 펴고 앉아 10초간 배가 부풀어 오를 정도로 깊게 숨을 들이마시고 내뱉으세요.",
      encouragement: "잠깐의 멈춤이 당신의 에너지를 다시 연결해 줄 거예요.",
      tag: "Focus",
      questType: "breathing",
      rationale: "의도적인 심호흡은 부교감 신경을 자극하여 코르티솔 수치를 즉각적으로 낮춥니다.",
      isAiGenerated: false
    };
  }
};