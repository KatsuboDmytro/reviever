import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { doc, getDoc } from "firebase/firestore";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

import { useAppDispatch } from "../../../../../app/hooks";
import { setNewsInfo } from "../../../../../features/newsSlice";
import { db } from "../../../../../firebase/firebase";
import { News } from "../../../../../types/News";
import {
  BorderButton,
  FormSection,
  MainButton,
  NewsPreview,
} from "../../../../index";
import "./editNews.scss";

export const EditNews = () => {
  const dispatch = useAppDispatch();
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(false);

  const { newsId } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);

        if (!newsId) {
          throw new Error("newsId is undefined");
        }
        const newsDocRef = doc(db, "news", newsId);
        const newsDocSnap = await getDoc(newsDocRef);

        if (newsDocSnap.exists()) {
          dispatch(setNewsInfo(newsDocSnap.data() as News));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [newsId]);

  return (
    <section className="edit-news container">
      <aside className="edit-news__edit">
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <div className="edit-news__edit-header">
              <h1>Конструктор новин</h1>
              <div className="edit-news__edit-buttons">
                {activeFormIndex > 1 && (
                  <BorderButton
                    onClick={() => setActiveFormIndex(activeFormIndex - 1)}
                  >
                    <ArrowLeft />
                  </BorderButton>
                )}
                {activeFormIndex < 3 && (
                  <MainButton
                    disabled={!enableNext}
                    onClick={() => {
                      console.log("activeFormIndex", activeFormIndex);
                      setActiveFormIndex(activeFormIndex + 1);
                    }}
                  >
                    Next <ArrowRight />
                  </MainButton>
                )}
              </div>
            </div>
            <FormSection
              enableNext={(val) => setEnableNext(val)}
              activeFormIndex={activeFormIndex}
            />
          </>
        )}
      </aside>
      <aside className="edit-news__template">
        <NewsPreview />
      </aside>
    </section>
  );
};
