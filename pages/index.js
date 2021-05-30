import Masonry from "react-masonry-css";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Navbar } from "../components/molecules";
import { Layout } from "../components/templates";

export default function Home(props) {
  const [images, setImages] = useState(props.images);
  const [hasMore, setHasMore] = useState(true);
  const [pageNow, setPageNow] = useState(2);

  const fetchMoreData = () => {
    fetch(`https://api.animemoe.us/waifu/?page=${pageNow}`)
      .then((res) => res.json())
      .then((response) => {
        if (response.next === null) {
          setHasMore(false);
        }

        setImages(images.concat(response.results));
        setPageNow(parseInt(pageNow) + 1);
      });
  };

  return (
    <Layout title="Waifu | AnimeMoeUs">
      <div style={{ backgroundColor: "#f2f2f2", minHeight: "100vh" }}>
        <Navbar />

        <div className="container-fluid mt-3">
          <InfiniteScroll
            dataLength={images.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<p className="text-center fs-3">Loading...</p>}
          >
            <Masonry
              breakpointCols={{ default: 5, 1100: 4, 700: 3, 500: 2 }}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {images.map((image) => (
                <div
                  key={image.id}
                  className="card grumpy-image-wrapper bg-light border-0 rounded-0 animate__animated animate__fadeIn"
                  style={{
                    paddingBottom: `${(image.height / image.width) * 100}%`,
                  }}
                >
                  <Link href={`/${image.image_id}/`}>
                    <a>
                      <Image src={image.thumbnail} layout={"fill"} />
                    </a>
                  </Link>
                </div>
              ))}
            </Masonry>
          </InfiniteScroll>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const res = await fetch("https://api.animemoe.us/waifu/");
  const response = await res.json();

  return { props: { images: response.results } };
}
