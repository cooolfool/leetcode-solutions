class Solution {
public:
    int mostWordsFound(vector<string>& sentences) {
        int len=sentences.size();
        int max=0;
        for(int i=0;i<len;i++){
            int count=0;
            string s=sentences[i];
            for(int j=0;j<s.length();j++){
                if(s.at(j)==' ')
                count++;
            }
            if(count>max)
            max=count;
        }
        return max+1;
    }
};