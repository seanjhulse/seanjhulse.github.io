'''
Are two rays intersecting? 
'''

import matplotlib.pyplot as plt
from random import randint
import math

'''
defines a ray in 2D using 4 points
@params {int} x1, y1, x2, y2
'''
class ray:
        def __init__(self, x1=None, y1=None, x2=None, y2=None, id=None):
                self.x1 = float(x1)
                self.y1 = float(y1)
                self.x2 = float(x2)
                self.y2 = float(y2)
                self.id = id

'''
checks to see if an intersection occurs with two rays
@params {ray} ray_1, ray_2
@return {boolean}
source: http://paulbourke.net/geometry/pointlineplane/
'''
def intersecting(ray_1, ray_2):
        if ray_1.id == ray_2.id:
            return

        denominator = ((ray_1.x2 - ray_1.x1) * (ray_2.y2 - ray_2.y1)) - ((ray_1.y2 - ray_1.y1) * (ray_2.x2 - ray_2.x1))
        numerator1 = ((ray_1.y1 - ray_2.y1) * (ray_2.x2 - ray_2.x1)) - ((ray_1.x1 - ray_2.x1) * (ray_2.y2 - ray_2.y1))
        numerator2 = ((ray_1.y1 - ray_2.y1) * (ray_1.x2 - ray_1.x1)) - ((ray_1.x1 - ray_2.x1) * (ray_1.y2 - ray_1.y1))

        # Detect coincident lines, infinite solutions.
        if denominator == 0:
                return False

        r = numerator1 / denominator
        s = numerator2 / denominator

        return (r >= 0 and r <= 1) and (s >= 0 and s <= 1)

'''
gets the intersection point of two rays
@params {ray} ray_1, ray_2
@return {tuple} x, y

x = x1 + ua (x2 - x1)
y = y1 + ua (y2 - y1)

source: http://paulbourke.net/geometry/pointlineplane/
'''
def get_intersection_point(ray_1, ray_2):
        if ray_1.id == ray_2.id:
            return

        denominator = ((ray_1.x2 - ray_1.x1) * (ray_2.y2 - ray_2.y1)) - ((ray_1.y2 - ray_1.y1) * (ray_2.x2 - ray_2.x1))
        numerator1 = ((ray_1.y1 - ray_2.y1) * (ray_2.x2 - ray_2.x1)) - ((ray_1.x1 - ray_2.x1) * (ray_2.y2 - ray_2.y1))
        numerator2 = ((ray_1.y1 - ray_2.y1) * (ray_1.x2 - ray_1.x1)) - ((ray_1.x1 - ray_2.x1) * (ray_1.y2 - ray_1.y1))

        # float denominator = ((b.X - a.X) * (d.Y - c.Y)) - ((b.Y - a.Y) * (d.X - c.X));
        # float numerator1 = ((a.Y - c.Y) * (d.X - c.X)) - ((a.X - c.X) * (d.Y - c.Y));
        # float numerator2 = ((a.Y - c.Y) * (b.X - a.X)) - ((a.X - c.X) * (b.Y - a.Y));

        if denominator == 0:
                return numerator1 == 0 and numerator2 == 0

        ua = numerator1 / denominator
        
        x = ray_1.x1 + ua * (ray_1.x2 - ray_1.x1)
        y = ray_1.y1 + ua * (ray_1.y2 - ray_1.y1)

        return (x, y)

'''
generates N pairs of rays and plots them
@params {int} num_of_ray_pairs that you want to plot
'''
def create_rays(num_of_ray_pairs):
        rays = []
        for i in range(num_of_ray_pairs):
                # define two rays
                ray_1 = ray(randint(-100, 100), randint(-100, 100), randint(-100, 100), randint(-100, 100))        
                ray_2 = ray(randint(-100, 100), randint(-100, 100), randint(-100, 100), randint(-100, 100))

                rays.append(ray_1)
                rays.append(ray_2)

                # plot the rays
                plt.plot([ray_1.x1,ray_1.x2],[ray_1.y1,ray_1.y2])
                plt.plot([ray_2.x1,ray_2.x2],[ray_2.y1,ray_2.y2])
                plt.draw()

        # find all intersections between all rays
        for ray_1 in rays:
                for ray_2 in rays:
                        if intersecting(ray_1, ray_2):
                                # get the intersection point
                                x, y = get_intersection_point(ray_1, ray_2)
                                # plot the intersection point
                                plt.plot(x, y, 'o')

'''
generates N pairs of squares and plots them
@params {int} num_of_sq_pairs that you want to plot
'''
def create_squares(num_of_sq_pairs):
        rays = []
        for i in range(num_of_sq_pairs):
                
                # define a square
                top = ray(randint(-100, 100), randint(-100, 100), randint(-100, 100), randint(-100, 100), i)

                # a square is just a single ray repeated
                shift = math.sqrt((top.x2 - top.x1)**2 + (top.y2 - top.y1)**2)

                bottom = ray(top.x1, top.y1 + shift, top.x2, top.y2 + shift, i)
                left = ray(top.x1, top.y1, top.x1, bottom.y1, i)
                right = ray(top.x2, top.y2, top.x2, bottom.y2, i)
                
                # append the rays to the array
                rays.append(top)
                rays.append(bottom)
                rays.append(left)
                rays.append(right)
                
                # plot the rays
                plt.plot([top.x1,top.x2],[top.y1,top.y2])
                plt.plot([bottom.x1,bottom.x2],[bottom.y1,bottom.y2])
                plt.plot([left.x1,left.x2],[left.y1,left.y2])
                plt.plot([right.x1,right.x2],[right.y1,right.y2])

                plt.draw()

        # find all intersections between all rays
        for ray_1 in rays:
                for ray_2 in rays:
                        if intersecting(ray_1, ray_2):
                                # get the intersection point
                                x, y = get_intersection_point(ray_1, ray_2)
                                # plot the intersection point
                                plt.plot(x, y, 'o')

# for i in range(5):
#         create_rays(2)
#         plt.pause(1)
#         plt.clf()

for i in range(100):
        create_squares(4)
        plt.pause(10)
        plt.clf()
