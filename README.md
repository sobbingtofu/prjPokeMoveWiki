# 이브이 위키 (EEVEE WIKI)

## 프로젝트 개요

EEVEE WIKI는 포켓몬스터 게임의 기술(Move)과 포켓몬(Pokemon) 정보를 쉽고 빠르게 검색할 수 있는 웹 애플리케이션입니다.

특히 기존 서비스들에선 찾을 수 없는 **특정 기술 조합을 배우는 포켓몬들을 검색**하는 기능에 특화되어 있으며,
실전 배틀 파티를 구상하는 포켓몬 트레이너들이 해당 기능을 특히 더 유용하게 쓸 수 있습니다.

Next.js 16과 TypeScript를 기반으로 제작되었으며,
PokeAPI의 방대한 데이터를 IndexedDB에 캐싱한 후 기술, 포켓몬, 기술을 배우는 포켓몬 등에 대한 조회 요청을 클라이언트 측에서 직접 처리하도록 해
별도의 서버 구축이 없는 가벼운 구조만으로도 빠르고 쾌적한 사용자 경험을 제공합니다.

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Data Fetching**: React Query, Axios
- **Web Crawling**: Cheerio
- **Database**: IndexedDB (Client-side caching)
- **API**: PokeAPI

## 주요 기능

- **기술 조합 습득 포켓몬 검색 (Multiple Moves Learning Pokemons Search)**:

  - 사용자가 선택한 하나 이상의 기술을 모두 배울 수 있는 포켓몬을 검색합니다.
  - **구현**: 선택된 기술 ID들을 기반으로, 해당 기술들을 모두 배우는 포켓몬 리스트를 교집합 연산을 통해 필터링하여 도출합니다.

- **상세 필터링 및 정렬**:

  - 세대(Generation, 1세대 ~ 9세대) 별 필터링, 습득 방법 (레벨업, 기술머신, 가르침기술 등) 별 필터링을 제공합니다.
  - 종족값 수치 및 포켓몬 이름 가나다 순 등 다양한 정렬 옵션을 제공합니다.
  - **구현**: Zustand 스토어에 필터 및 정렬 옵션 상태를 관리하고, 커스텀 훅(`useApplyFilters`, `useApplySortings`)을 통해 실시간으로 결과 리스트를 가공해 컴포넌트에서 사용할 수 있도록 설계되어있습니다.

- **포켓몬 상세 정보 조회**:

  - 종족값(Stats), 방어 상성(Type Effectiveness), 진화 체인(Evolution Chain), 배우는 기술 목록 등 포켓몬에 대한 다양한 정보를 각 정보 별 속성에 적합한 형태의 UI로 전달합니다.
  - **구현**: `DetailedPokemonSection` 컴포넌트에서 포켓몬의 ID를 기반으로 상세 데이터를 렌더링하며, 방어 상성은 `getTypeDefenseMatchup` 유틸리티를 통해 계산됩니다.

- **기술 상세 정보 조회**:

  - 위력, 명중률, PP, 타입, 분류(물리/특수/변화) 등 포켓몬의 기술에 대한 다양한 정보를 정보 별 속성에 적합한 형태의 UI로 전달합니다.
  - **구현**: `DetailedMoveSection`을 통해 기술의 상세 스펙과 해당 기술을 배우는 포켓몬 목록을 보여줍니다.

- **기술 이미지 동적 웹 크롤링 (Move Image Dynamic Web Crawling)**:

  - 나무위키에서 특정 포켓몬 기술의 연출 이미지를 실시간으로 크롤링하여 제공합니다.
  - **구현**: Next.js API Route에서 `Cheerio`를 사용해 나무위키 페이지를 파싱하고, `React Query`를 통해 클라이언트에서 비동기로 이미지를 로드 및 캐싱합니다.

- **고성능 데이터 캐싱 (IndexedDB)**:

  - 방대한 포켓몬 및 기술 데이터를 브라우저의 IndexedDB에 저장하여, 재방문 시 로딩 속도를 획기적으로 단축했습니다.
  - **구현**: `indexedDBLogics` 모듈을 통해 최초 접속 시 데이터를 가져와 저장하고, 이후 접속부터는 로컬 DB에서 데이터를 불러옵니다. 최초 저장 시의 시점 정보를 추가적으로 저장해, 지정된 시간이 지나면 indexedDB의 정보를 새로 가져오도록 해 데이터의 유효성 또한 보장합니다.

- **반응형 디자인 (Mobile & Desktop)**:
  - 데스크탑에서는 분할 화면(Split View), 모바일에서는 바텀 시트(Bottom Sheet) UI를 제공하여 기기에 최적화된 경험을 제공합니다.
  - **구현**: Tailwind CSS의 반응형 유틸리티 클래스와 조건부 렌더링을 통해 화면 크기에 따른 레이아웃 변경을 구현했습니다.

## 프로젝트 구조 (Project Structure)

```
src/
├── app/                        # Next.js App Router 페이지 및 레이아웃
│   ├── api/                    # 내부 API 라우트 (이미지 프록시 등)
│   ├── moves/                  # 기술 상세 페이지
│   ├── pokemons/               # 포켓몬 상세 페이지
│   ├── search-learning-pokemon/# 기술 습득 포켓몬 검색 (메인 기능)
│   └── ...
├── components/                 # 재사용 가능한 UI 컴포넌트
│   ├── AbilityGrid             # 특성 정보 그리드
│   ├── EvolChainSection        # 진화 사슬 섹션
│   ├── MoveCard                # 기술 정보 카드
│   ├── PokemonSearch           # 포켓몬 검색 컴포넌트
│   ├── StatGrid                # 종족값 차트/그리드
│   ├── TypeDefenseGrid         # 방어 상성표
│   └── ...
├── hooks/                      # 커스텀 훅 (데이터 로딩, 필터링, 정렬 로직)
│   ├── useApplyFilters.ts      # 필터 적용 로직
│   ├── useLoadData_...         # 데이터 로딩 로직
│   └── ...
├── logic/                      # 비즈니스 로직 및 유틸리티
│   ├── indexedDBLogics/        # IndexedDB 제어 로직
│   └── pokeapiLogics/          # PokeAPI 데이터 처리 로직
├── store/                      # 전역 상태 관리 (Zustand)
│   └── zustandStore.ts         # 메인 스토어 파일
└── utils/                      # 순수 함수 및 헬퍼 함수
    ├── getTypeDefenseMatchup.tsx # 방어 상성 계산
    └── pokeApiUtils.tsx        # API 데이터 가공 유틸
```
