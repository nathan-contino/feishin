import styled from '@emotion/styled';
import { Center, Skeleton } from '@mantine/core';
import { RiAlbumFill } from 'react-icons/ri';
import { generatePath } from 'react-router';
import { Link } from 'react-router-dom';
import { ListChildComponentProps } from 'react-window';
import { Text } from '@/renderer/components/text';
import { GridCardControls } from '@/renderer/components/virtual-grid/grid-card/grid-card-controls';
import { fadeIn } from '@/renderer/styles';
import {
  PlayQueueAddOptions,
  LibraryItem,
  CardRow,
  CardRoute,
} from '@/renderer/types';

const CardWrapper = styled.div<{
  itemGap: number;
  itemHeight: number;
  itemWidth: number;
}>`
  flex: ${({ itemWidth }) => `0 0 ${itemWidth}px`};
  width: ${({ itemWidth }) => `${itemWidth}px`};
  height: ${({ itemHeight }) => `${itemHeight}px`};
  margin: ${({ itemGap }) => `0 ${itemGap / 2}px`};
  transition: border 0.2s ease-in-out;
  user-select: none;
  pointer-events: auto; // https://github.com/bvaughn/react-window/issues/128#issuecomment-460166682

  &:hover div {
    opacity: 1;
  }

  &:hover * {
    &::before {
      opacity: 0.5;
    }
  }

  &:focus-visible {
    outline: 1px solid #fff;
  }
`;

const StyledCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  height: 100%;
  padding: 0;
  border-radius: 5px;
`;

const ImageSection = styled.div`
  position: relative;
  width: 100%;
  border-radius: 5px;

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 100%) 35%,
      rgba(0, 0, 0, 0%) 100%
    );
    opacity: 0;
    transition: all 0.2s ease-in-out;
    content: '';
    user-select: none;
  }
`;

interface ImageProps {
  height: number;
  isLoading?: boolean;
}

const Image = styled.img<ImageProps>`
  ${fadeIn};
  width: ${({ height }) => `${height}px`};
  height: ${({ height }) => `${height}px`};
  object-fit: cover;
  border: 0;
  border-radius: 2px;
`;

const ControlsContainer = styled.div`
  position: absolute;
  bottom: 0;
  z-index: 50;
  width: 100%;
  opacity: 0;
  transition: all 0.2s ease-in-out;
`;

const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div<{ secondary?: boolean }>`
  width: 100%;
  max-width: 100%;
  height: 25px;
  padding: 0 0.2rem;
  overflow: hidden;
  color: ${({ secondary }) =>
    secondary ? 'var(--main-fg-secondary)' : 'var(--main-fg)'};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

interface BaseGridCardProps {
  columnIndex: number;
  controls: {
    cardControls: any[];
    cardRows: CardRow[];
    handlePlayQueueAdd: (options: PlayQueueAddOptions) => void;
    itemType: LibraryItem;
    route?: CardRoute;
  };
  data: any;
  listChildProps: Omit<ListChildComponentProps, 'data' | 'style'>;
  sizes: {
    itemGap: number;
    itemHeight: number;
    itemWidth: number;
  };
}

export const PosterCard = ({
  listChildProps,
  data,
  columnIndex,
  controls,
  sizes,
}: BaseGridCardProps) => {
  const { isScrolling, index } = listChildProps;
  const { itemGap, itemHeight, itemWidth } = sizes;
  const { cardControls, handlePlayQueueAdd, itemType, cardRows, route } =
    controls;

  if (data) {
    return (
      <CardWrapper
        key={`card-${columnIndex}-${index}`}
        itemGap={itemGap}
        itemHeight={itemHeight}
        itemWidth={itemWidth}
      >
        <StyledCard>
          {route ? (
            <Link
              tabIndex={0}
              to={generatePath(
                route.route,
                route.slugs?.reduce((acc, slug) => {
                  return {
                    ...acc,
                    [slug.slugProperty]: data[slug.idProperty],
                  };
                }, {})
              )}
            >
              <ImageSection style={{ height: `${itemWidth}px` }}>
                {data?.imageUrl ? (
                  <Image height={itemWidth} src={data?.imageUrl} />
                ) : (
                  <Center
                    sx={{
                      background: 'var(--placeholder-bg)',
                      borderRadius: '5px',
                      height: '100%',
                    }}
                  >
                    <RiAlbumFill color="var(--placeholder-fg)" size={35} />
                  </Center>
                )}
                <ControlsContainer>
                  {!isScrolling && (
                    <GridCardControls
                      cardControls={cardControls}
                      handlePlayQueueAdd={handlePlayQueueAdd}
                      itemData={data}
                      itemType={itemType}
                    />
                  )}
                </ControlsContainer>
              </ImageSection>
            </Link>
          ) : (
            <ImageSection style={{ height: `${itemWidth}px` }}>
              {data?.imageUrl ? (
                <Image height={itemWidth} src={data?.imageUrl} />
              ) : (
                <Center
                  sx={{
                    background: 'var(--placeholder-bg)',
                    borderRadius: '5px',
                    height: '100%',
                  }}
                >
                  <RiAlbumFill color="var(--placeholder-fg)" size={35} />
                </Center>
              )}
              <ControlsContainer>
                {!isScrolling && (
                  <GridCardControls
                    cardControls={cardControls}
                    handlePlayQueueAdd={handlePlayQueueAdd}
                    itemData={data}
                    itemType={itemType}
                  />
                )}
              </ControlsContainer>
            </ImageSection>
          )}
          <DetailSection>
            {cardRows.map((row: CardRow, index: number) => {
              if (row.arrayProperty) {
                if (row.route) {
                  return (
                    <Row secondary={index > 0}>
                      {data[row.property].map(
                        (item: any, itemIndex: number) => (
                          <>
                            {itemIndex > 0 && (
                              <Text
                                sx={{
                                  display: 'inline-block',
                                  padding: '0 2px 0 1px',
                                }}
                              >
                                ,
                              </Text>
                            )}{' '}
                            <Text
                              link
                              component={Link}
                              overflow="hidden"
                              secondary={index > 0}
                              to={generatePath(
                                row.route!.route,
                                row.route!.slugs?.reduce((acc, slug) => {
                                  return {
                                    ...acc,
                                    [slug.slugProperty]: data[slug.idProperty],
                                  };
                                }, {})
                              )}
                            >
                              {row.arrayProperty && item[row.arrayProperty]}
                            </Text>
                          </>
                        )
                      )}
                    </Row>
                  );
                }

                return (
                  <Row>
                    {data[row.property].map((item: any) => (
                      <Text overflow="hidden" secondary={index > 0}>
                        {row.arrayProperty && item[row.arrayProperty]}
                      </Text>
                    ))}
                  </Row>
                );
              }

              return (
                <Row key={row.property}>
                  {row.route ? (
                    <Text
                      link
                      component={Link}
                      overflow="hidden"
                      to={generatePath(
                        row.route.route,
                        row.route.slugs?.reduce((acc, slug) => {
                          return {
                            ...acc,
                            [slug.slugProperty]: data[slug.idProperty],
                          };
                        }, {})
                      )}
                    >
                      {data && data[row.property]}
                    </Text>
                  ) : (
                    <Text overflow="hidden" secondary={index > 0}>
                      {data && data[row.property]}
                    </Text>
                  )}
                </Row>
              );
            })}
          </DetailSection>
        </StyledCard>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper
      key={`card-${columnIndex}-${index}`}
      itemGap={itemGap}
      itemHeight={itemHeight}
      itemWidth={itemWidth}
    >
      <StyledCard>
        <Skeleton visible radius="sm">
          <ImageSection style={{ height: `${itemWidth}px` }} />
        </Skeleton>
        <DetailSection>
          {cardRows.map((row: CardRow, index: number) => (
            <Skeleton
              key={`row-${row.property}`}
              my={2}
              radius="md"
              visible={!data}
              width={!data ? (index > 0 ? '50%' : '90%') : '100%'}
            >
              <Row />
            </Skeleton>
          ))}
        </DetailSection>
      </StyledCard>
    </CardWrapper>
  );
};
