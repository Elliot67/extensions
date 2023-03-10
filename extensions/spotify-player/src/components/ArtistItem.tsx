import { Image } from "@raycast/api";
import { ListOrGridItem } from "./ListOrGridItem";
import { ArtistActionPanel } from "./ArtistActionPanel";

type ArtistItemProps = {
  type: "grid" | "list";
  artist: SpotifyApi.ArtistObjectFull;
};

export function ArtistItem({ type, artist }: ArtistItemProps) {
  const icon: Image.ImageLike = {
    source: artist.images[0]?.url ?? "",
    mask: type === "list" ? Image.Mask.Circle : undefined,
  };

  const title = `${artist.name}`;

  return (
    <ListOrGridItem
      type={type}
      icon={icon}
      title={title}
      content={icon}
      actions={<ArtistActionPanel title={title} artist={artist} />}
    />
  );
}
