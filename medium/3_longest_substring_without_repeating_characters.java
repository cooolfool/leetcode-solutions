class Solution {
    public int lengthOfLongestSubstring(String s) {
        int l = 0, r = 0, maxLen = 0, len = s.length();
        Map<Character, Integer> map = new HashMap();

        for (r = 0; r < len; r++) {
            Character c = s.charAt(r);
            if (!map.containsKey(c)) {
                map.put(c, r);
               
            }
            else {
                if (l <= map.get(c)) {
                   // maxLen = Math.max(maxLen, r - l);
                    l = map.get(c) + 1;
                    map.put(c, r);
                } else {
                    map.put(c, r);
                }
               
            }
              maxLen = Math.max(maxLen, r - l+1);
        }
        if(map.size()==len)
        return len;
        return maxLen;
    }
}