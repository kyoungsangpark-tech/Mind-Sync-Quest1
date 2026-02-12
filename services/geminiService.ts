import { GoogleGenAI, Type } from "@google/genai";
import { MBTIState, Situation, QuestResult, UserHistory } from "../types";

export const generateQuest = async (
  mbti: MBTIState,
  situation: Situation,
  moodLabel: string,
  history: UserHistory[]
): Promise<QuestResult> => {
  // 가이드라인 준수: 반드시 new GoogleGenAI({ apiKey: process.env.API_KEY }) 사용
  // 빌드 타임에 vite.config.ts에서 process.env.API_KEY를 치환함
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const mbtiString = `${mbti.E ? 'E' : 'I'}${mbti.S ? 'S' : 'N'}${mbti.T ? 'T' : 'F'}${mbti.J ? 'J' : 'P'}`;
  const now = new Date();
  const hour = now.getHours();

  let timeTheme = "";
  if (hour >= 5 && hour < 11) timeTheme = "활력과 확언";
  else if (hour >= 11 && hour < 18) timeTheme = "감각 환기와 집중력";
  else if (hour >= 18 && hour < 22) timeTheme = "이완과 하루 성찰";
  else timeTheme = "정적 휴식과 마인드풀니스";

  const prompt = `
    [초정밀 심리 분석 요청]
    당신은 사용자 맞춤형 마이크로 퀘스트 설계자입니다.
    
    사용자 데이터:
    - 성격 유형(MBTI): ${mbtiString}
    - 물리적 환경: ${situation}
    - 현재 감정 주파수: ${moodLabel}
    - 시간적 맥락: ${timeTheme} (현재 시간: ${now.toLocaleTimeString()})

    지시사항:
    1. ${situation}에서 별도의 도구 없이 '지금 당장' 1분 내에 실행할 수 있는 동작을 제시하십시오.
    2. ${mbtiString} 성향의 인지적 특성을 반영하여 심리적 효과를 극대화하십시오.
    3. 'rationale'에는 이 행동이 ${moodLabel} 상태를 어떻게 과학적으로 개선하는지 논리적으로 설명하십시오.
    4. 친절하면서도 전문적인 톤을 유지하십시오.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: prompt,
      config: {
        systemInstruction: "당신은 긍정 심리학 및 행동 경제학 전문가입니다. 사용자의 상황(Context)을 완벽하게 동기화하여 최적의 1분 처방을 JSON으로 제공합니다.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "퀘스트의 제목" },
            instruction: { type: Type.STRING, description: "구체적인 행동 지침 (1분 분량)" },
            encouragement: { type: Type.STRING, description: "사용자를 향한 따뜻한 격려" },
            tag: { type: Type.STRING, description: "퀘스트의 핵심 키워드 (1-2단어)" },
            questType: { type: Type.STRING, description: "퀘스트의 유형 (movement, breathing, sensory 등)" },
            rationale: { type: Type.STRING, description: "이 행동이 효과적인 심리학적/생리학적 근거" },
          },
          required: ["title", "instruction", "encouragement", "tag", "questType", "rationale"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("EMPTY_AI_RESPONSE");

    return { 
      ...JSON.parse(resultText), 
      id: 'ai_' + Date.now(),
      isAiGenerated: true 
    } as QuestResult;
  } catch (error) {
    console.error("Gemini API Error details:", error);
    // 폴백 퀘스트
    return {
      id: 'fallback_' + Date.now(),
      title: "마음 한 조각 숨쉬기",
      instruction: "3초간 숨을 깊게 들이마시고, 5초간 천천히 내뱉으며 어깨의 긴장을 풀어보세요.",
      encouragement: "잠시의 호흡만으로도 당신의 뇌는 휴식을 얻습니다.",
      tag: "Relax",
      questType: "breathing",
      rationale: "의도적인 긴 호흡은 부교감 신경을 즉각적으로 활성화하여 스트레스를 낮춥니다.",
      isAiGenerated: false
    };
  }
};