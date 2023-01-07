import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
  Flex,
} from "@chakra-ui/react";

import { FiUser, FiScissors } from "react-icons/fi";
import { FaMoneyBillAlt } from "react-icons/fa";
import { ScheduleItem } from "../../pages/dashboard";

interface ModalInfoProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  data: ScheduleItem;
  finishService: () => Promise<void>;
}

export default function ModalInfo({
  isOpen,
  onOpen,
  onClose,
  data,
  finishService,
}: ModalInfoProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="barber.400">
        <ModalHeader color="#fff">Próximo</ModalHeader>
        <ModalCloseButton color="#fff" />

        <ModalBody>
          <Flex align="center" mb={5}>
            <FiUser fontSize={28} color="#ffb13e" />
            <Text color="#fff" ml={3} fontSize="2xl" fontWeight="bold">
              {data?.customer}
            </Text>
          </Flex>

          <Flex align="center" mb={5}>
            <FiScissors fontSize={28} color="#fff" />
            <Text color="#fff" ml={3} fontSize="lg" fontWeight="bold">
              {data?.haircut?.name}
            </Text>
          </Flex>

          <Flex align="center" mb={5}>
            <FaMoneyBillAlt fontSize={28} color="#46ef75" />
            <Text color="#fff" ml={3} fontSize="lg" fontWeight="bold">
              R$ {data?.haircut?.price}
            </Text>
          </Flex>

          <ModalFooter>
            <Button
              bg="button.cta"
              _hover={{
                bg: "#ffb13e",
              }}
              mr={3}
              onClick={() => finishService}
              fontWeight="bold"
              color="gray.700"
            >
              Finalizar serviço
            </Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
