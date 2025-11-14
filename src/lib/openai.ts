import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ChordAnalysis {
  chords: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  suggestions: string[]
  alternativeTones: string[]
  practiceTime: string
}

export async function analyzeChords(
  chords: string,
  lyrics: string,
  tone: string
): Promise<ChordAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Você é um professor de violão especializado em análise de cifras. 
          Analise os acordes fornecidos e retorne um JSON com:
          - chords: array com todos os acordes únicos encontrados
          - difficulty: nível de dificuldade (beginner/intermediate/advanced)
          - suggestions: dicas práticas para tocar a música
          - alternativeTones: tons alternativos mais fáceis
          - practiceTime: tempo estimado para dominar (ex: "2-3 semanas")`
        },
        {
          role: 'user',
          content: `Analise esta cifra:
          Tom: ${tone}
          Acordes: ${chords}
          Letra: ${lyrics.substring(0, 500)}...`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })

    const analysis = JSON.parse(response.choices[0].message.content || '{}')
    return analysis as ChordAnalysis
  } catch (error) {
    console.error('Erro ao analisar acordes:', error)
    throw new Error('Falha ao analisar acordes com IA')
  }
}

export async function generateChordSuggestions(
  songTitle: string,
  artist: string
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em cifras de violão. Forneça a cifra completa com acordes e letra.'
        },
        {
          role: 'user',
          content: `Forneça a cifra completa de "${songTitle}" - ${artist} com acordes e letra.`
        }
      ],
      temperature: 0.7,
    })

    return response.choices[0].message.content || ''
  } catch (error) {
    console.error('Erro ao gerar sugestões:', error)
    throw new Error('Falha ao gerar sugestões de acordes')
  }
}
