import { useState } from "react";
import Head from "next/head";
import {
  Button,
  Flex,
  Heading,
  Text,
  Link as ChakraLink,
  useMediaQuery,
  useDisclosure,
} from "@chakra-ui/react";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { Sidebar } from "../../components/sidebar";
import Link from "next/link";
import { IoMdPerson } from "react-icons/io";
import { setupAPIClient } from "../../services/api";
import ModalInfo from "../../components/modal";

export interface ScheduleItem {
  id: string;
  customer: string;
  haircut: {
    id: string;
    name: string | number;
    price: string | number;
    user_id: string;
  };
}
interface DashboardProps {
  schedule: ScheduleItem[];
}

export default function Dashboard({ schedule }: DashboardProps) {
  const [list, setList] = useState(schedule);
  const { onClose, onOpen, isOpen } = useDisclosure();
  const [service, setService] = useState<ScheduleItem>();

  const [isMobile] = useMediaQuery("(max-width:500px)");

  function handleOpenModal(item: ScheduleItem) {
    setService(item);
    onOpen();
  }

  return (
    <>
      <Head>
        <title>BarberPRO - Minha barbearia</title>
      </Head>

      <Sidebar>
        <Flex direction="column" align="flex-start" justify="flex-start">
          <Flex w="100%" direction="row" align="center" justify="flex-start">
            <Heading fontSize="3xl" mt={4} mb={4} mr={4}>
              Agenda
            </Heading>

            <Link href="/new" legacyBehavior>
              <Button bg="gray.700">Registrar</Button>
            </Link>
          </Flex>
          {list.map((item) => (
            <ChakraLink
              onClick={() => handleOpenModal(item)}
              w="100%"
              m={0}
              p={0}
              mt={2}
              bg="transparent"
              style={{ textDecoration: "none" }}
              key={item?.id}
            >
              <Flex
                w="100%"
                direction={isMobile ? "column" : "row"}
                p={4}
                rounded={8}
                bg="barber.400"
                justify="space-between"
                align={isMobile ? "flex-start" : "center"}
              >
                <Flex
                  direction="row"
                  mb={isMobile ? 2 : 0}
                  align="center"
                  justify="flex-start"
                  minW="33%"
                >
                  <IoMdPerson size={28} color="#fba931" />
                  <Text fontWeight="bold" ml={4} noOfLines={2}>
                    {item?.customer}
                  </Text>
                </Flex>

                <Flex minW="33%" align="center" justify="center">
                  <Text fontWeight="bold" mb={isMobile ? 2 : 0}>
                    {item?.haircut?.name}
                  </Text>
                </Flex>

                <Flex
                  minW="33%"
                  align="center"
                  alignItems="flex-end"
                  justify="flex-end"
                >
                  <Text fontWeight="bold" mb={isMobile ? 2 : 0}>
                    R${item?.haircut?.price}
                  </Text>
                </Flex>
              </Flex>
            </ChakraLink>
          ))}
        </Flex>
      </Sidebar>

      <ModalInfo
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        data={service}
        finishService={async () => {}}
      />
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/schedule");

    return {
      props: {
        schedule: response.data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        schedule: [],
      },
    };
  }
});
