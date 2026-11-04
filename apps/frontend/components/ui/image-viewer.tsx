'use client';

import { EyeIcon } from 'lucide-react';
import NextImage, { ImageProps as NextImageProps } from 'next/image';
import { forwardRef } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

interface ImageViewerProps extends NextImageProps {
  previewTitle?: string;
}

const ImageViewer = forwardRef<HTMLImageElement, ImageViewerProps>(
  ({ previewTitle, ...props }, ref) => {
    return (
      <PhotoProvider
        maskOpacity={0.7}
        speed={() => 300}
        toolbarRender={() => <div>{previewTitle || props.alt}</div>}
      >
        <PhotoView src={props.src as string}>
          <div className="relative w-fit">
            <NextImage
              ref={ref}
              loader={({ src }) => `${src}?w=${props.width}&h=${props.height}`}
              {...props}
              alt={props.alt}
            />

            <div className="absolute inset-0 flex cursor-pointer items-center justify-center opacity-0 transition-opacity duration-300 hover:bg-black/50 hover:opacity-100">
              <div className="flex items-center justify-center gap-1">
                <EyeIcon className="h-4 w-4 text-white" />
                <span className="text-white">Preview</span>
              </div>
            </div>
          </div>
        </PhotoView>
      </PhotoProvider>
    );
  }
);

ImageViewer.displayName = 'ImageViewer';

interface ImageViewerContainerProps {
  src: string;
  previewTitle?: string;
  alt?: string;
  children: React.ReactNode;
}

const ImageViewerContainer = forwardRef<
  HTMLDivElement,
  ImageViewerContainerProps
>(({ previewTitle, children, src, alt }, ref) => {
  return (
    <PhotoProvider
      maskOpacity={0.7}
      speed={() => 400}
      toolbarRender={() => <div>{previewTitle || alt}</div>}
    >
      <PhotoView src={src}>
        <div ref={ref}>{children}</div>
      </PhotoView>
    </PhotoProvider>
  );
});

ImageViewerContainer.displayName = 'ImageViewerContainer';

export { ImageViewer, ImageViewerContainer };
