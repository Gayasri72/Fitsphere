import { useContext } from "react";
import { PostsContext } from "./PostsContext";

const usePosts = () => useContext(PostsContext);

export { usePosts };
