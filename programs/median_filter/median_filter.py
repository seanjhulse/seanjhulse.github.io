from scipy import misc
import numpy as np
from PIL import Image
import statistics


'''
Finds an average value for 3 CHANNEL pixel based on it's neighbors
inside the bounding box
@param pixel is the current pixel index tuple
@param bound is the bounding box we'll search
'''
def rgb_basic_median(img, pixel, bound=4):
	height, width = img.shape[0], img.shape[1]
	# get starting pixels indices
	row_start = pixel[0] - bound
	row_bound = pixel[0] + bound 

	col_start = pixel[1] - bound
	col_bound = pixel[1] + bound

	# tracks the pixels we're averaging over
	r = [0]
	g = [0]
	b = [0]

	# scan
	for row_index in range(row_start, row_bound):
		for col_index in range(col_start, col_bound):
			if row_index >= 0 and row_index < height and col_index >= 0 and col_index < width:
				R,G,B = img[row_index][col_index]
				if (R == 255 and G == 255 and B == 255) or (R == 0 and G == 0 and B == 0): continue
				r.append(R)
				g.append(G)
				b.append(B)

	r.sort()
	g.sort()
	b.sort()

	R = r[len(r) // 2]
	G = g[len(g) // 2]
	B = b[len(b) // 2]
	
	return [R, G, B]

'''
Finds an average value for the single CHANNEL pixel based on it's neighbors
inside the bounding box
@param pixel is the current pixel index
@param bound is the bounding box we'll search
'''
def bw_basic_median(img, pixel, bound=4):
	height, width = img.shape[0], img.shape[1]
	# get starting pixels indices
	row_start = pixel[0] - bound
	row_bound = pixel[0] + bound 

	col_start = pixel[1] - bound
	col_bound = pixel[1] + bound

	# tracks the pixels we're averaging over
	p = [255]

	# scan
	for row_index in range(row_start, row_bound):
		for col_index in range(col_start, col_bound):
			if row_index >= 0 and row_index < height and col_index >= 0 and col_index < width:
				P = img[row_index][col_index]
				if (P == 255 or P == 0): continue

				p.append(P)

	p.sort()

	P = p[len(p) // 2]
	
	return [P, P, P]

def median_filter(in_file, out_file):
	img = misc.imread(in_file)
	channel = len(img.shape)
	height, width = img.shape[0], img.shape[1]
	temp = np.zeros((height, width, 3), dtype=np.uint8)

	# iterate over each pixel in the image
	for row_index, row in enumerate(img):
		for col_index, col in enumerate(row):
			pixel = (row_index, col_index)

			if channel == 2:
				median_pixel = bw_basic_median(img, pixel, 2)
			else:
				R,G,B = img[pixel]
				if (R >= 220 and G >= 220 and B >= 220) or (R == 0 and G == 0 and B == 0):
					median_pixel = rgb_basic_median(img, pixel, 2)
				else:
					median_pixel = img[pixel]
					
			temp[pixel] = median_pixel
	
	misc.imsave(out_file, temp)
# median_filter("sample-noise.png", "sample-removed-noise.png")
# median_filter("sample-noise2.png", "sample-removed-noise2.png")
# median_filter("noisy-x-ray.png", "x-ray-removed-noise.png")
median_filter("sample-noise.png", "sample-removed-noise-enhanced.png")
