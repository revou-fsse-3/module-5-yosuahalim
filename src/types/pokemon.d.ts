type Pokemon = {
  base_experience: number;
  name: string;
  stats: Stat[];
  sprites: {
    front_default: string;
  };
};

type Stat = {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
};
