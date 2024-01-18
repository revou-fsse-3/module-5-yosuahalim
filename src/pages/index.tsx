import Image from "next/image";
import { Inter } from "next/font/google";
import { GetServerSidePropsContext, GetStaticPropsContext } from "next";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import axios from "axios";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  pokemon: Pokemon;
};

export default function Home(Props: Props) {
  const query = useSearchParams();
  const queryPokemon = query.get("pokemon");

  console.log(query.get("pokemon"));

  const navigate = useRouter();

  const [search, setSearch] = useState({
    name: "pikachu",
  });
  const [pokemon, setPokemon] = useState<Pokemon>({} as Pokemon);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // const searchAction = useRef(
  //   debounce((e) => {
  //     setSearch((prev) => ({
  //       ...prev,
  //       name: e.target.value,
  //     }));
  //   }, 500)
  // ).current;

  const fetchPokemon = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${queryPokemon}`
      );
      setPokemon(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, [navigate]);

  const handleClick = () => {
    navigate.push(`/?pokemon=${search.name}`);
  };

  console.log(pokemon);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div>
        <nav className="flex">
          <ul className="flex space-x-3">
            <li>
              <Link href={"/"}>Home</Link>
            </li>
            <li>
              <Link href="/form">Form</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
          </ul>
        </nav>

        <div>
          <h1 className="text-3xl">Pokemon Stats</h1>

          <input
            type="text"
            placeholder="Enter Pokemon Name"
            className="border-2 border-black rounded-md p-2 mt-4 text-black"
            onChange={(e) => setSearch({ ...search, name: e.target.value })}
          />

          <button
            className="border-2 border-black transition-all duration-300 ease-out rounded-md p-2 mt-4 ml-2 hover:bg-slate-500"
            onClick={handleClick}
          >
            Search Pokemon
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center text-center mt-6">Loading...</div>
        ) : (
          <div className="flex justify-center">
            <Image
              className="w-[200px]"
              src={pokemon?.sprites?.front_default}
              alt=""
              height={200}
              width={200}
            />

            <div className="mt-4">
              <h2 className="text-left font-semibold text-lg">Status</h2>
              {pokemon?.stats?.map((stat, index) => (
                <div className="flex space-x-2" key={index}>
                  <p>{stat.stat.name}</p>
                  <p>{stat.base_stat}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

//This gets called on every request
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Fetch data from external API
  console.log(context);
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${context.query.pokemon ?? "pikachu"}`
  );
  const data = await res.json();

  // Pass data to the page via props
  return { props: { pokemon: data } };
}
