import { GoogleGenAI, Type } from "@google/genai";
import { MBTIState, Situation, QuestResult, UserHistory } from "../types";

export const generateQuest = async (
  mbti: MBTIState,
  situation: Situation,
  moodLabel: string,
  history: UserHistory[]
): Promise<QuestResult> => {
  // 가이드라인 준수: 반드시 new GoogleGenAI({ apiKey: process.env.API_KEY }) 사용
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
    [초정밀 심리 및 상황 동기화 분석 요청]
    당신은 세계 최고 수준의 행동 심리학자이자 긍정 심리학 전문가입니다.
    사용자의 성격(MBTI), 물리적 환경(Situation), 감정(Mood), 시간적 맥락(Time)을 완벽하게 동기화하여 '지금 당장' 실행 가능한 1분 처방을 내리십시오.

    사용자 데이터 세부 분석:
    1. 성격(MBTI): ${mbtiString} (${mbti.T ? '논리적 효용성' : '정서적 지지'} 중심의 접근 필요)
    2. 물리적 상황: ${situation} (이 환경에서 즉시 수행 가능한 행동이어야 함)
    3. 감정 상태: ${moodLabel} (이 감정을 완화하거나 긍정적으로 전환할 것)
    4. 시간적 맥락: ${timeTheme} (에너지 레벨에 맞는 난이도 조절)

    퀘스트 설계 원칙:
    - No Tools: 주변의 평범한 사물이나 자신의 신체만을 이용할 것.
    - 60 Seconds: 정확히 1분 내외로 끝낼 수 있는 마이크로 인터벤션.
    - Scientific Basis: 뇌과학, 인지심리학, 혹은 신체 심리학적 근거를 바탕으로 할 것.

    결과는 반드시 유효한 JSON 형식으로 출력하십시오.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: prompt,
      config: {
        systemInstruction: "당신은 사용자의 현재 맥락을 100% 이해하고 개인화된 심리 퀘스트를 생성하는 AI입니다. 퀘스트 제목은 창의적이어야 하며, 지침은 매우 구체적이어야 합니다.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "퀘스트의 독창적인 제목" },
            instruction: { type: Type.STRING, description: "지금 당장 실행할 구체적인 행동 지침" },
            encouragement: { type: Type.STRING, description: "사용자에게 용기를 북돋는 한마디" },
            tag: { type: Type.STRING, description: "퀘스트 성격 (예: 집중, 이완, 활력)" },
            questType: { type: Type.STRING, description: "유형 (movement, breathing, sensory, cognitive)" },
            rationale: { type: Type.STRING, description: "이 행동이 해당 MBTI와 감정에 왜 효과적인지에 대한 심리학적 근거" },
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
    console.error("Gemini API Ultra-Precision Analysis Error:", error);
    // 폴백 퀘스트 (사용자가 빈 화면을 보지 않도록 보장)
    return {
      id: 'fallback_' + Date.now(),
      title: "마음의 창 넓히기",
      instruction: "지금 눈 앞에 보이는 가장 멀리 있는 물체를 10초간 가만히 응시하며 심호흡하세요.",
      encouragement: "시야를 넓히면 좁아졌던 마음의 여유도 다시 찾아옵니다.",
      tag: "Focus",
      questType: "sensory",
      rationale: "먼 곳을 응시하는 것은 시각적 긴장을 완화하여 뇌의 투쟁-도피 반응을 낮추는 효과가 있습니다.",
      isAiGenerated: false
    };
  }
};