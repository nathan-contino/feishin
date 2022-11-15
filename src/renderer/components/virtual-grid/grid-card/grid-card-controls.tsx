import React, { MouseEvent } from 'react';
import { Group, UnstyledButtonProps } from '@mantine/core';
import { motion, Variants } from 'framer-motion';
import {
  RiPlayFill,
  RiMore2Fill,
  RiHeartFill,
  RiHeartLine,
} from 'react-icons/ri';
import styled from 'styled-components';
import { _Button } from '@/renderer/components/button';
import { DropdownMenu } from '@/renderer/components/dropdown-menu';
import { LibraryItem, Play, PlayQueueAddOptions } from '@/renderer/types';

type PlayButtonType = UnstyledButtonProps &
  React.ComponentPropsWithoutRef<'button'>;

const PlayButton = styled(motion.button)<PlayButtonType>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background-color: rgb(255, 255, 255);
  border: none;
  border-radius: 50%;
  transition: opacity 0.2s ease-in-out;
  transition: scale 0.2s ease-in;

  svg {
    fill: rgb(0, 0, 0);
    stroke: rgb(0, 0, 0);
  }
`;

const SecondaryButton = styled(motion(_Button))`
  fill: white !important;
  svg: {
    fill: white !important;
  }
`;

const GridCardControlsContainer = styled.div`
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

const PLAY_TYPES = [
  {
    label: 'Play',
    play: Play.NOW,
  },
  {
    label: 'Play last',
    play: Play.LAST,
  },
  {
    label: 'Play next',
    play: Play.NEXT,
  },
];

export const GridCardControls = ({
  itemData,
  itemType,
  handlePlayQueueAdd,
  playButtonBehavior,
}: {
  handlePlayQueueAdd: (options: PlayQueueAddOptions) => void;
  itemData: any;
  itemType: LibraryItem;
  playButtonBehavior: Play;
}) => {
  const buttonVariants: Variants = {
    hover: {
      opacity: 1,
      scale: 1.1,
    },
    initial: {
      opacity: 0.6,
      scale: 1,
    },
    pressed: {
      scale: 1,
    },
  };

  return (
    <GridCardControlsContainer>
      <TopControls />
      <CenterControls animate={{ opacity: 1 }} initial={{ opacity: 0 }} />
      <BottomControls>
        <PlayButton
          initial="initial"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="pressed"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handlePlayQueueAdd({
              byItemType: {
                id: itemData.id,
                type: itemType,
              },
              play: playButtonBehavior,
            });
          }}
        >
          <RiPlayFill size={25} />
        </PlayButton>
        <Group spacing="xs">
          <SecondaryButton
            disabled
            p={5}
            sx={{ svg: { fill: 'white !important' } }}
            variant="subtle"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="pressed"
          >
            <FavoriteWrapper isFavorite={itemData?.isFavorite}>
              {itemData?.isFavorite ? (
                <RiHeartFill size={20} />
              ) : (
                <RiHeartLine color="white" size={20} />
              )}
            </FavoriteWrapper>
          </SecondaryButton>
          <DropdownMenu withinPortal position="bottom-start">
            <DropdownMenu.Target>
              <SecondaryButton
                initial="initial"
                p={5}
                sx={{ svg: { fill: 'white !important' } }}
                variant="subtle"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="pressed"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <RiMore2Fill color="white" size={20} />
              </SecondaryButton>
            </DropdownMenu.Target>
            <DropdownMenu.Dropdown>
              {PLAY_TYPES.filter(
                (type) => type.play !== playButtonBehavior
              ).map((type) => (
                <DropdownMenu.Item
                  key={`playtype-${type.play}`}
                  onClick={(e: MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePlayQueueAdd({
                      byItemType: {
                        id: itemData.id,
                        type: itemType,
                      },
                      play: type.play,
                    });
                  }}
                >
                  {type.label}
                </DropdownMenu.Item>
              ))}
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
