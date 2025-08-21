class Solution {
public:
    vector<string> buildArray(vector<int>& target, int n) {
        
        vector<string> str;
        int i=1;
        for(int j=0;j<target.size();j++)
        {
            while(target[j]>i)
            {
                str.push_back("Push");
                str.push_back("Pop");
                i++;
            }
            str.push_back("Push");
            i++;
        }
        return str;
    }
};