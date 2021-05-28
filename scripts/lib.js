/**
 * This function returns a value that has been linearly interpolated between p0 and p1
 *
 * @param  {float}  p0      The first float
 * @param  {float}  p1      The second float
 * @param  {float}  t       A normalized value between 0.0 and 1.0, 0.0 returning p0 and 1.0 returning p1
 * @return {float}          The interpolated value
 */
export function lerp(p0, p1, t){
    return p0 + t*(p1 - p0);
}

/**
 * This function gets the middle value of the two given value
 *
 * @param  {number}    p0    The first value
 * @param  {number}    p1    The second value
 * @return {number}          The middle value
 */
export function mid(p0, p1){
    return (p0+p1)/2;
}

/**
 * This function normalizes a value (v) between min and max
 *
 * @param  {number}  v       The value to be normalized
 * @param  {number}  min     The minimum value
 * @param  {number}  max     The maximum value
 * @return {number}          The normalized value
 */
export function norm(v, min, max)
{
    return (v - min) / (max - min);
}

/**
 * This function returns an float between a minimum and maximum value
 *
 * @param  {number}     min    The minimum value
 * @param  {number}     max    The maximum value
 * @return {number}            A random value between the range given
 */
export function random_float_between(min, max){
    return Math.random() * (max - min) + min;
}

/**
 * This function returns an integer between a minimum and maximum value
 *
 * @param  {number}     min    The minimum value
 * @param  {number}     max    The maximum value
 * @return {int}               A random integer between the range given
 */
export function random_int_between(min, max){
    return Math.floor(random_float_between(min, max));
}

/**
 * This function determines if the given parameter is a callable function
 *
 * @param  {function}   inFunc    The function object to be tested
 * @return {boolean}              A boolean whether the function is actually a function
 */
export function is_function(inFunc){
    return inFunc && (
        {}.toString.call(inFunc) === '[object Function]'
        ||
        {}.toString.call(inFunc) === '[object AsyncFunction]'
    );
}