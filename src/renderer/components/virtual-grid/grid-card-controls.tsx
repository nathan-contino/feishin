import React from 'react';
import styled from '@emotion/styled';
import { Box, UnstyledButton, Group, UnstyledButtonProps } from '@mantine/core';
import { motion } from 'framer-motion';
import {
  RiPlayFill,
  RiMore2Fill,
  RiHeartFill,
  RiHeartLine,
} from 'react-icons/ri';
import { Button } from '@/renderer/components/button';
import { DropdownMenu } from '@/renderer/components/dropdown-menu';
import { Play } from '@/renderer/types';

type PlayButtonType = UnstyledButtonProps &
  React.ComponentPropsWithoutRef<'button'>;

const PlayButton = styled(UnstyledButton)<PlayButtonType>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background-color: rgb(255, 255, 255);
  border-radius: 50%;
  opacity: 0.8;
  transition: opacity 0.2s ease-in-out;
  transition: scale 0.2s ease-in;

  &:hover {
    opacity: 1;
    scale: 1.1;
  }

  svg {
    fill: rgb(0, 0, 0);
    stroke: rgb(0, 0, 0);
  }
`;

const GridCardControlsContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const ControlsRow = styled(motion.div)`
  width: 100%;
  height: calc(100% / 3);
`;

const TopControls = styled(ControlsRow)`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0.5rem;
`;

const CenterControls = styled(ControlsRow)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
`;

const BottomControls = styled(ControlsRow)`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 1rem 0.5rem;
`;

const FavoriteWrapper = styled.span<{ isFavorite: boolean }>`
  svg {
    fill: ${(props) => props.isFavorite && 'var(--primary-color)'};
  }
`;

export const GridCardControls = ({
  itemData,
  itemType,
  handlePlayQueueAdd,
}: any) => {
  return (
    <GridCardControlsContainer>
      <TopControls />
      <CenterControls animate={{ opacity: 1 }} initial={{ opacity: 0 }} />
      <BottomControls>
        <PlayButton
          onClick={() => {
            handlePlayQueueAdd({
              byItemType: {
                id: itemData.id,
                type: itemType,
              },
              play: Play.NOW,
            });
          }}
        >
          <RiPlayFill size={25} />
        </PlayButton>
        <Group spacing="xs">
          <Button disabled p={5} variant="subtle">
            <FavoriteWrapper isFavorite={itemData?.isFavorite}>
              {itemData?.isFavorite ? (
                <RiHeartFill size={20} />
              ) : (
                <RiHeartLine color="white" size={20} />
              )}
            </FavoriteWrapper>
          </Button>
          <DropdownMenu withinPortal position="bottom-start">
            <DropdownMenu.Target>
              <Button p={5} variant="subtle">
                <RiMore2Fill color="white" size={20} />
              </Button>
            </DropdownMenu.Target>
            <DropdownMenu.Dropdown>
              <DropdownMenu.Item>Play next</DropdownMenu.Item>
              <DropdownMenu.Item>Play later</DropdownMenu.Item>
              <DropdownMenu.Divider />
              <DropdownMenu.Item disabled>Add to playlist</DropdownMenu.Item>
              <DropdownMenu.Divider />
              <DropdownMenu.Item disabled>Refresh metadata</DropdownMenu.Item>
            </DropdownMenu.Dropdown>
          </DropdownMenu>
        </Group>
      </BottomControls>
    </GridCardControlsContainer>
  );
};