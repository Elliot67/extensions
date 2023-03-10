import { Image, Icon } from "@raycast/api";
import { ListOrGridItem } from "./ListOrGridItem";
import { PlaylistActionPanel } from "./PlaylistActionPanel";

type PlaylistItemProps = {
  type: "grid" | "list";
  playlist: SpotifyApi.PlaylistObjectSimplified;
};

export default function PlaylistItem({ type, playlist }: PlaylistItemProps) {
  const title = playlist.name;
  const subtitle = playlist.owner.display_name;
  const imageURL = playlist.images[playlist.images.length - 1]?.url;
  const icon: Image.ImageLike = {
    source: imageURL ?? Icon.BlankDocument,
  };

  return (
    <ListOrGridItem
      type={type}
      icon={icon}
      title={title}
      subtitle={subtitle}
      content={icon}
      accessories={[{ text: `${playlist.tracks.total} songs` }]}
      actions={<PlaylistActionPanel title={title} playlist={playlist} />}
    />
  );
}
