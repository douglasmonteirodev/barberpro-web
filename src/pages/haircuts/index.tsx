import {
  Button,
  Flex,
  Heading,
  Stack,
  Switch,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { useState, ChangeEvent } from "react";
import Head from "next/head";
import Link from "next/link";
import { Sidebar } from "../../components/sidebar";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";
import { IoMdPricetag } from "react-icons/io";

interface HaircutsItem {
  id: string;
  name: string;
  price: number | string;
  status: boolean;
  user_id: string;
}
interface HaircutsProps {
  haircuts: HaircutsItem[];
}

export default function Haircuts({ haircuts }: HaircutsProps) {
  const [haircutList, setHaircutList] = useState<HaircutsItem[]>(
    haircuts || []
  );

  const [disableHaircut, setDisableHaircut] = useState("enabled");

  const [isMobile] = useMediaQuery("(max-width: 500px)");

  async function handleDisable(e: ChangeEvent<HTMLInputElement>) {
    const apiClient = setupAPIClient();

    if (e.target.value === "disabled") {
      setDisableHaircut("enabled");

      const response = await apiClient.get("/haircuts", {
        params: {
          status: true,
        },
      });

      setHaircutList(response.data);
    } else {
      setDisableHaircut("disabled");

      const response = await apiClient.get("/haircuts", {
        params: {
          status: false,
        },
      });

      setHaircutList(response.data);
    }
  }
  return (
    <>
      <Head>
        <title>Modelos de cortes - Minha barbearia</title>
      </Head>

      <Sidebar>
        <Flex
          direction="column"
          alignItems="flex-start"
          justifyContent="flex-start"
        >
          <Flex
            direction={isMobile ? "column" : "row"}
            w="100%"
            alignItems={isMobile ? "column" : "center"}
            justifyContent="flex-start"
          >
            <Heading
              fontSize={isMobile ? "28px" : "3xl"}
              mt={4}
              mb={4}
              mr={4}
              color="orange.900"
            >
              Modelos de cortes
            </Heading>

            <Link href="/haircuts/new">
              <Button bg="gray.700">Cadastrar novo</Button>
            </Link>

            <Stack ml="auto" alignItems="center" direction="row">
              <Text fontWeight="bold">
                {disableHaircut === "enabled" ? "ATIVOS" : "DESATIVOS"}
              </Text>
              <Switch
                colorScheme="green"
                size="lg"
                value={disableHaircut}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleDisable(e)
                }
                isChecked={disableHaircut === "disabled" ? false : true}
              />
            </Stack>
          </Flex>

          {haircutList.map((haircut) => (
            <Link
              href={`/haircuts/${haircut.id}`}
              legacyBehavior
              key={haircut.id}
            >
              <Flex
                cursor="pointer"
                width="100%"
                p={4}
                bg="barber.400"
                direction={isMobile ? "column" : "row"}
                align={isMobile ? "flex-start" : "center"}
                rounded={4}
                mb={2}
                mt={isMobile ? 5 : 0}
                justifyContent="space-between"
              >
                <Flex
                  mb={isMobile ? 2 : 0}
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                >
                  <IoMdPricetag size={28} color="#fba931" />
                  <Text fontWeight="bold" ml={4} noOfLines={2}>
                    {haircut.name}
                  </Text>
                </Flex>

                <Text fontWeight="bold" color="#fff">
                  Preço: R$ {haircut.price}
                </Text>
              </Flex>
            </Link>
          ))}
        </Flex>
      </Sidebar>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/haircuts", {
      params: {
        status: true,
      },
    });

    if (response.data === null) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }
    return {
      props: {
        haircuts: response.data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
});
