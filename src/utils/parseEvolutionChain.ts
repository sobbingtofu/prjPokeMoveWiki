// API 응답 타입 정의
interface NamedAPIResource {
  name: string;
  url: string;
}

interface EvolutionDetail {
  base_form_id: number | null;
  gender: number | null;
  held_item: NamedAPIResource | null;
  item: NamedAPIResource | null;
  known_move: NamedAPIResource | null;
  known_move_type: NamedAPIResource | null;
  location: NamedAPIResource | null;
  min_affection: number | null;
  min_beauty: number | null;
  min_happiness: number | null;
  min_level: number | null;
  needs_overworld_rain: boolean;
  party_species: NamedAPIResource | null;
  party_type: NamedAPIResource | null;
  region_id: number | null;
  relative_physical_stats: number | null;
  time_of_day: string;
  trade_species: NamedAPIResource | null;
  trigger: NamedAPIResource;
  turn_upside_down: boolean;
}

interface ChainLink {
  evolution_details: EvolutionDetail[];
  evolves_to: ChainLink[];
  is_baby: boolean;
  species: NamedAPIResource;
}

interface EvolutionChainData {
  baby_trigger_item: NamedAPIResource | null;
  chain: ChainLink;
  id: number;
}

// 결과 타입 정의
interface ParsedEvolution {
  chainLevel: number;
  name: string;
  url: string;
}

// 파싱 함수
export function parseEvolutionChain(data: EvolutionChainData): ParsedEvolution[] {
  const result: ParsedEvolution[] = [];

  function processChain(chain: ChainLink, level: number): void {
    // 현재 레벨의 species 정보 추가
    result.push({
      chainLevel: level,
      name: chain.species.name,
      url: chain.species.url,
    });

    // evolves_to가 있고 배열이 비어있지 않으면 재귀 처리
    if (chain.evolves_to && chain.evolves_to.length > 0) {
      chain.evolves_to.forEach((evolution: ChainLink) => {
        processChain(evolution, level + 1);
      });
    }
  }

  // chain부터 시작 (chainLevel 1)
  processChain(data.chain, 1);

  return result;
}
